import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { supabase, SUPABASE_TABLE } from './config/supabaseClient';
import dseLogo from './assets/dse.png';
import iecLogo from './assets/iec.png';
import jmcLogo from './assets/jmc.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Eco-Meter 10 Criteria and their specific level statements
const criteriaData = [
  {
    id: "Safe Drinking Water",
    title: "Safe Drinking Water",
    levels: {
      1: "No contamination in the water source. Storage or distribution of drinking water, Students need to have awareness of safe drinking water.",
      2: "Good source of water & storage is done in a clean way. 40-60% students have awareness about drinking water.",
      3: "The school has high standards of water storage. 70-80% students have awareness about safe drinking water.",
      4: "Good mechanism of source protection, storage & distribution. Have a system of continuous assessment & review of safe drinking water. All students are aware about Safe Drinking Water."
    }
  },
  {
    id: "Clean Toilets",
    title: "Clean Toilets",
    levels: {
      1: "Need for a basic toilet facility. Need for awareness about clean toilets.",
      2: "Basic Toliet Facility available. Need to ensure basic maintenance. 40-60% students have awareness about clean toilets.",
      3: "The school has clean toilets. Toilets are fully functional with all the necessary aspects in place. 70- 80% students are aware about clean toilets.",
      4: "The school has clean & hygienic toilets. Has high standards for cleanliness with an efficient system of assessment, review of the toilet maintenance. All students are aware about clean toilets."
    }
  },
  {
    id: "Personal Hygiene",
    title: "Personal Hygiene",
    levels: {
      1: "Students need information and understanding about personal hygiene.",
      2: "40-60% students are aware of the need for personal hygiene.",
      3: "70-80% students have a clear understanding of personal hygiene.",
      4: "The schools has clear guidelines for the following of personal hygiene practices. Ensures adherence in a sensitive manner."
    }
  },
  {
    id: "Clean Classroom",
    title: "Clean Classrooms",
    levels: {
      1: "Classrooms require major re-organisation and maintenance.",
      2: "Basic maintenance is ensured across classrooms.",
      3: "Most (70-80%) of the classrooms in the schools are well-organised and well-maintained.",
      4: "School has an overall standards & guidelines for clean classrooms and follows a 5S process: Sort, Set in order, Shine, Standardize, Sustain."
    }
  },
  {
    id: "School Campus",
    title: "School Premises",
    levels: {
      1: "Students need awareness about clean & well-maintained school premises. Campus is in need of basic maintenance and a compound wall.",
      2: "School premises has been kept litter-free but needs more attention in other aspects.",
      3: "School is litter-free. It has an effective waste-disposal mechanism. All the unused material and debris are properly organised. The sewage system is clean. Ground is maintained well to avoid water-clogging.",
      4: "All the areas in the school are well-maintained. The school has a clear guideline and review mechanism to maintain a clean campus. All students having a high level of awareness for a clean & green campus."
    }
  },
  {
    id: "Waste Management",
    title: "Solid Waste Management",
    levels: {
      1: "Students need to have awareness about the importance of solid waste management & the need for compost pits.",
      2: "School has created two compost pits but it needs to be used effectively. 40-60% students are aware.",
      3: "Solid waste is being segregated effectively in the pits created. 70-80% students are aware about Solid waste management.",
      4: "The school is able to generate a sizable quantity of good quality compost. All students are aware about the need for solid waste management."
    }
  },
  {
    id: "School Vegetable Garden",
    title: "School Vegetable Garden",
    levels: {
      1: "Students need to be aware about the use of school vegetable garden. School needs to find a specific place to initiate the School Vegetable Garden.",
      2: "40-60% students are aware. School has a space for school vegetable garden and they have started preliminary activities.",
      3: "70-80% students have an awareness about school vegetable garden. The School Vegetable Garden is well-maintained and vegetables are used for mid-day meals.",
      4: "Students have a good understanding of nutritional value. Definite plan for a toxin-free garden. Clear strategy for year-round use in mid-day meals."
    }
  },
  {
    id: "Tree Planting",
    title: "Tree Planting",
    levels: {
      1: "Students need to be aware about the need for tree-planting.School needs to identify a specific place for tree-planting.",
      2: "40-60% students are aware about the need for tree-planting.School has a space and initiated planting.",
      3: "70-80% students have an awareness.The school is implementing tree-planting activities on a regular basis.",
      4: "The school has a clear plan for tree-planting activities in the neighborhood.Actively involved with the SMC."
    }
  },
  {
    id: "Upcycling",
    title: "Upcycling-Recycling",
    levels: {
      1: "Students need to be aware of the concept of upcycling and recycling of materials.",
      2: "40-60% students are aware about upcycling. Students have initiated recycling and upcycling activities.",
      3: "70-80% students are aware about the concept. Students have created products for demonstration & display.",
      4: "The school has clear guidelines for upcycling and recycling activities. Students are actively involved in these activities on a regular basis."
    }
  },
  {
    id: "Plastic Free Campus",
    title: "Plastic Free Campus",
    levels: {
      1: "School needs to have a plan & strategy for Single Use Plastic (SUP)-free campus. Students need to be aware of SUP.",
      2: "The school has started the practice of segregating plastic waste. 40-60% students have an awareness about SUP.",
      3: "70-80% students are aware of SUP-free campus. The school has a clear plan for SUP campus & are actively ensuring maintenance.",
      4: "The school has declared itself as a plastic-free campus. The school is actively reaching out to the local community to promote the initiative."
    }
  }
];

function App() {
  // Common Form States
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluationDate, setEvaluationDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  
  // Google Sheets Integration & Loading States
  const [schoolList, setSchoolList] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [schoolLoadError, setSchoolLoadError] = useState('');
  const [hierarchy, setHierarchy] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [role, setRole] = useState('');

  // Initialize scores with no default values
  const [scores, setScores] = useState({});
  const [activeCriteriaIndex, setActiveCriteriaIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const scorecardRef = useRef(null);
  const schoolSelectionRef = useRef(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // 1. Fetch School List from Google Sheets
  useEffect(() => {
    // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwm5vTN_1K7EsC7Vr9nWH3RrT1tEXwRitKccKVvB-1x6JI3VzSobOh7q4sh_7GQCXP7/exec";

    fetch(scriptUrl)
      .then(response => response.json())
      .then(data => {
        setSchoolList(data);
        setIsLoadingSchools(false);
      })
      .catch(error => {
        console.error("Error fetching school list:", error);
        setSchoolLoadError("Unable to load school list. Please check your network or Google Apps Script URL.");
        setIsLoadingSchools(false);
      });
  }, []);

  useEffect(() => {
    if (!schoolList || schoolList.length === 0) {
      setHierarchy({});
      return;
    }

    const h = {};

    schoolList.forEach(row => {
      const state = row && row.state ? String(row.state).trim() : '';
      const district = row && row.district ? String(row.district).trim() : '';
      const zone = row && row.zone ? String(row.zone).trim() : '';
      const cluster = row && row.cluster ? String(row.cluster).trim() : '';
      const school = row && row.school ? String(row.school).trim() : '';

      if (!state || !district || !zone || !cluster || !school) return;

      if (!h[state]) h[state] = {};
      if (!h[state][district]) h[state][district] = {};
      if (!h[state][district][zone]) h[state][district][zone] = {};
      if (!h[state][district][zone][cluster]) h[state][district][zone][cluster] = [];

      if (!h[state][district][zone][cluster].includes(school)) {
        h[state][district][zone][cluster].push(school);
      }
    });

    console.log("Parsed hierarchy:", h);
    setHierarchy(h);
  }, [schoolList]);

  useEffect(() => {
    if (!selectedState && !selectedDistrict && !selectedZone && !selectedCluster && !schoolName && !role && !evaluatorName && !evaluationDate) return;
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    const scrollToLatestField = window.setTimeout(() => {
      const fields = schoolSelectionRef.current?.querySelectorAll('.school-field-item, .form-group');
      const latestField = fields?.[fields.length - 1];
      latestField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);

    return () => window.clearTimeout(scrollToLatestField);
  }, [selectedState, selectedDistrict, selectedZone, selectedCluster, schoolName, role, evaluatorName, evaluationDate]);

  const states = Object.keys(hierarchy).sort();
  const districts = selectedState && hierarchy[selectedState] ? Object.keys(hierarchy[selectedState]).sort() : [];
  const zones = selectedDistrict && hierarchy[selectedState]?.[selectedDistrict] ? Object.keys(hierarchy[selectedState][selectedDistrict]).sort() : [];
  const clusters = selectedZone && hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone] ? Object.keys(hierarchy[selectedState][selectedDistrict][selectedZone]).sort() : [];
  const schoolsForSelection = selectedCluster && hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone]?.[selectedCluster] ? hierarchy[selectedState][selectedDistrict][selectedZone][selectedCluster].sort() : [];
  const isContactNumberValid = /^[6-9]\d{9}$/.test(contactNumber.trim());

  const gradeMap = {
    1: 'B',
    2: 'B+',
    3: 'A',
    4: 'A+'
  };

  const getGrade = (score) => score && gradeMap[score] ? gradeMap[score] : '-';
  const getLevelPercent = (score) => {
    const levelPercentMap = {
      1: 25,
      2: 50,
      3: 75,
      4: 100
    };

    return levelPercentMap[score] || 0;
  };

  const scoredCriteria = criteriaData.filter((item) => scores[item.id]);
  const completedCriteriaCount = scoredCriteria.length;
  const totalScore = scoredCriteria.reduce((sum, item) => sum + (scores[item.id] || 0), 0);
  const overallPercentage = criteriaData.length ? Math.round((totalScore / (criteriaData.length * 4)) * 100) : 0;
  const averageScore = completedCriteriaCount ? (totalScore / completedCriteriaCount).toFixed(1) : '0.0';
  const overallBand = overallPercentage >= 75 ? 'Excellent' : overallPercentage >= 50 ? 'Strong' : overallPercentage >= 25 ? 'Developing' : 'Needs attention';
  const highestLevel = scoredCriteria.reduce((best, item) => {
    const currentScore = scores[item.id];
    return currentScore > best.score ? { score: currentScore, title: item.title } : best;
  }, { score: 0, title: 'Awaiting evaluation' });
  const scoreRanking = scoredCriteria
    .map((item) => ({ ...item, score: scores[item.id], grade: getGrade(scores[item.id]) }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const strengths = scoreRanking.slice(0, 3);
  const focusAreas = [...scoreRanking]
    .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
    .slice(0, 3);

  const handleScoreChange = (criteriaId, value) => {
    setScores(prev => ({ ...prev, [criteriaId]: parseInt(value) }));
    setIsSubmitted(false);

    const selectedCriteriaIndex = criteriaData.findIndex(c => c.id === criteriaId);

    if (selectedCriteriaIndex === activeCriteriaIndex && selectedCriteriaIndex < criteriaData.length - 1) {
      setActiveCriteriaIndex(selectedCriteriaIndex + 1);
    }
  };

  const handlePreviousCriteria = () => {
    if (activeCriteriaIndex > 0) {
      setActiveCriteriaIndex(activeCriteriaIndex - 1);
    }
  };

  const handleNextCriteria = () => {
    if (activeCriteriaIndex < criteriaData.length - 1) {
      setActiveCriteriaIndex(activeCriteriaIndex + 1);
    }
  };

  const handleDownloadPdf = async () => {
    const scorecardElement = scorecardRef.current;

    if (!scorecardElement) {
      window.print();
      return;
    }

    try {
      scorecardElement.classList.add('pdf-exporting');
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);

      const createExportPage = (selectors, pageClassName) => {
        const page = document.createElement('section');
        page.className = `scorecard-section pdf-exporting pdf-export-page ${pageClassName}`;

        const visualLayer = document.createElement('div');
        visualLayer.className = 'pdf-eco-visuals';
        visualLayer.setAttribute('aria-hidden', 'true');
        visualLayer.innerHTML = `
          <span class="pdf-eco-icon pdf-eco-icon-leaf">🌿</span>
          <span class="pdf-eco-icon pdf-eco-icon-recycle">♻️</span>
          <span class="pdf-eco-icon pdf-eco-icon-water">💧</span>
          <span class="pdf-eco-icon pdf-eco-icon-spark">✨</span>
        `;
        page.appendChild(visualLayer);

        selectors.forEach((selector) => {
          const section = scorecardElement.querySelector(selector);
          if (section) {
            page.appendChild(section.cloneNode(true));
          }
        });

        return page;
      };

      const exportRoot = document.createElement('div');
      exportRoot.className = 'pdf-export-root';
      document.body.appendChild(exportRoot);

      const exportPages = [
        createExportPage([
          '.scorecard-topbar',
          '.scorecard-school-download-section',
          '.scorecard-summary-grid',
          '.scorecard-insights-grid'
        ], 'pdf-page-one'),
        createExportPage([
          '.scorecard-table-section',
          '.scorecard-chart-section'
        ], 'pdf-page-two')
      ];

      for (let pageIndex = 0; pageIndex < exportPages.length; pageIndex += 1) {
        const exportPage = exportPages[pageIndex];
        exportRoot.appendChild(exportPage);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const canvas = await html2canvas(exportPage, {
          scale: 1.25,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: exportPage.scrollWidth,
          height: exportPage.scrollHeight,
          logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.82);
        let imgWidth = maxWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > maxHeight) {
          const fitRatio = maxHeight / imgHeight;
          imgWidth *= fitRatio;
          imgHeight = maxHeight;
        }

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const imageLeft = (pageWidth - imgWidth) / 2;
        pdf.addImage(imgData, 'JPEG', imageLeft, margin, imgWidth, imgHeight, `scorecard-page-${pageIndex}`, 'FAST');
        exportPage.remove();
      }

      exportRoot.remove();

      pdf.save(`${schoolName ? schoolName.replace(/[^a-zA-Z0-9-_ ]/g, '') : 'scorecard'}-scorecard.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      window.print();
    } finally {
      scorecardElement.classList.remove('pdf-exporting');
      document.querySelectorAll('.pdf-export-root').forEach((node) => node.remove());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const indianMobileRegex = /^[6-9]\d{9}$/;

    if (!schoolName.trim()) {
      alert("Please select a school name first!");
      return;
    }

    if (!contactNumber.trim()) {
      alert("Contact Number is mandatory!");
      return;
    }

    if (!indianMobileRegex.test(contactNumber.trim())) {
      alert("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    // Validate that all criteria have been scored
    const allScored = criteriaData.every(c => scores[c.id] !== undefined);
    if (!allScored) {
      alert("Please answer all Specific Criteria Evaluation questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    const finalData = {
      schoolInfo: {
        schoolName,
        role,
        evaluatorName,
        evaluationDate,
        contactNumber
      },
      evaluations: criteriaData.map(c => ({
        criteria: c.title,
        score: scores[c.id],
        statement: c.levels[scores[c.id]]
      }))
    };

    const payload = {
      school_name: schoolName,
      role,
      evaluator_name: evaluatorName,
      evaluation_date: evaluationDate,
      contact_number: contactNumber,
      state: selectedState,
      district: selectedDistrict,
      zone: selectedZone,
      cluster: selectedCluster,
      scores: finalData.evaluations
    };
    
    try {
      const { error } = await supabase.from(SUPABASE_TABLE).insert([payload]);

      if (error) {
        throw error;
      }

      console.log("Collected Data:", finalData);
      setIsSubmitted(true);
      setSubmitMessage({
        type: 'success',
        text: 'Evaluation submitted successfully.\nThank you for completing the Eco Meter assessment.'
      });
      // Scroll to top to see scorecard
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Supabase insert error:', error);
      const isRlsError = error?.message?.toLowerCase().includes('row-level security');
      setSubmitMessage({
        type: 'error',
        text: isRlsError
          ? 'Insert blocked by Supabase RLS. Enable an INSERT policy for public.eco_evaluations in your Supabase dashboard.'
          : error?.message || 'Unable to save to Supabase. Check the table name and RLS policy.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      {isSubmitting && (
        <div className="saving-overlay" role="status" aria-live="polite">
          <div className="saving-popup">
            <div className="saving-spinner"></div>
            <h2 style={{ color: "#145c32", marginTop: "15px", marginBottom: "10px" }}>Saving...</h2>
            <p>Please wait while your evaluation is being submitted.</p>
          </div>
        </div>
      )}

      <div className="container">

        {/* Header Section - Banner Style */}
        <header className="header-banner print-hide">
          <div className="banner-container">
            <div className="banner-left">
              <img src={dseLogo} alt="DSE Logo" className="banner-logo" />
            </div>

            <div className="banner-center">
              <h1 className="banner-title">CLEAN SCHOOLS - HAPPY SCHOOLS</h1>
              <p className="banner-subtitle">Jammu Leads the Way</p>
            </div>

            <div className="banner-right">
              <div className="banner-logos-right">
                <img src={jmcLogo} alt="JMC Logo" className="banner-logo-right" />
                <img src={iecLogo} alt="IEC Logo" className="banner-logo-right" />
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          {!isSubmitted && (
            <form onSubmit={handleSubmit} className="print-hide">
              <section className="card school-info-card" ref={schoolSelectionRef}>
                <div className="card-header">
                  <div>
                    <h2 className="card-title">School Selection</h2>
                    <p className="card-subtitle">
                      Follow the steps to select your school from the list.
                    </p>
                  </div>
                  <div className="question-progress-widget"></div>
                </div>

                <div className="school-selection-fields">
                  <div className="school-field-item">
                    <label className="school-field-label">State</label>
                    {isLoadingSchools ? (
                      <p style={{ margin: 0, padding: "14px", color: "#6c757d", fontSize: "14px" }}>
                        Loading school data...
                      </p>
                    ) : schoolLoadError ? (
                      <p style={{ margin: 0, padding: "14px", color: "#c0392b", fontSize: "14px" }}>
                        {schoolLoadError}
                      </p>
                    ) : (
                      <select
                        className="form-control school-select"
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedDistrict('');
                          setSelectedZone('');
                          setSelectedCluster('');
                          setSchoolName('');
                          setRole('');
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                      >
                        <option value="" disabled>-- Select State --</option>
                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                      </select>
                    )}
                  </div>

                  {selectedState && (
                    <div className="school-field-item">
                      <label className="school-field-label">District</label>
                      <select
                        className="form-control school-select"
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setSelectedZone('');
                          setSelectedCluster('');
                          setSchoolName('');
                          setRole('');
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                      >
                        <option value="" disabled>-- Select District --</option>
                        {districts.map(district => <option key={district} value={district}>{district}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedDistrict && (
                    <div className="school-field-item">
                      <label className="school-field-label">Zone</label>
                      <select
                        className="form-control school-select"
                        value={selectedZone}
                        onChange={(e) => {
                          setSelectedZone(e.target.value);
                          setSelectedCluster('');
                          setSchoolName('');
                          setRole('');
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                      >
                        <option value="" disabled>-- Select Zone --</option>
                        {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedZone && (
                    <div className="school-field-item">
                      <label className="school-field-label">Cluster</label>
                      <select
                        className="form-control school-select"
                        value={selectedCluster}
                        onChange={(e) => {
                          setSelectedCluster(e.target.value);
                          setSchoolName('');
                          setRole('');
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                      >
                        <option value="" disabled>-- Select Cluster --</option>
                        {clusters.map(cluster => <option key={cluster} value={cluster}>{cluster}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedCluster && (
                    <div className="school-field-item">
                      <label className="school-field-label">School Name</label>
                      <select
                        className="form-control school-select"
                        value={schoolName}
                        onChange={(e) => {
                          setSchoolName(e.target.value);
                          setRole('');
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="" disabled>-- Select School --</option>
                        {schoolsForSelection.map((school, index) => <option key={index} value={school}>{school}</option>)}
                      </select>
                    </div>
                  )}

                  {schoolName && (
                    <div className="school-field-item">
                      <label htmlFor="role" className="school-field-label">Role</label>
                      <select
                        id="role"
                        className="form-control school-select"
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value);
                          setEvaluatorName('');
                          setEvaluationDate('');
                          setContactNumber('');
                        }}
                        required
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="" disabled>-- Select Role --</option>
                        <option value="HOI">HOI</option>
                        <option value="Nodal Teacher">Nodal Teacher</option>
                        <option value="SMC Precedence">SMC Precedence</option>
                        <option value="Eco Club Member">Eco Club Member</option>
                        <option value="Local Influencer">Local Influencer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>

                {role && (
                  <>
                    <hr style={{ border: 'none', borderTop: '1px solid #ececec', margin: '30px 0' }} />
                    <div className="card-header">
                      <div>
                        <h2 className="card-title">Evaluator Details</h2>
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="evaluatorName">Evaluator Name</label>
                        <input
                          id="evaluatorName"
                          className="form-control"
                          type="text"
                          value={evaluatorName}
                          onChange={(e) => setEvaluatorName(e.target.value)}
                          placeholder="Enter Evaluator Name"
                          required
                        />
                      </div>

                      {evaluatorName && evaluatorName.trim() !== '' && (
                        <div className="form-group">
                          <label htmlFor="evaluationDate">Evaluation Date</label>
                          <input
                            id="evaluationDate"
                            className="form-control"
                            type="date"
                            value={evaluationDate}
                            onChange={(e) => setEvaluationDate(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {evaluationDate && (
                        <div className="form-group">
                          <label htmlFor="contactNumber">Contact Number</label>
                          <input
                            id="contactNumber"
                            className="form-control"
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => {
                              setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                              setScores({});
                              setActiveCriteriaIndex(0);
                              setIsSubmitted(false);
                            }}
                            placeholder="Enter 10-digit mobile number"
                            inputMode="numeric"
                            pattern="[6-9][0-9]{9}"
                            maxLength={10}
                            title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>

              {isContactNumberValid && (
                <section className="card">
                  <div className="card-header">
                    <div>
                      <h2 className="card-title">Specific Criteria Evaluation</h2>
                    </div>
                  </div>

                  <div className="criteria-list-single">
                    {(() => {
                      const item = criteriaData[activeCriteriaIndex];
                      const index = activeCriteriaIndex;
                      const safeId = item.id.replace(/\s+/g, '-').toLowerCase();

                      return (
                        <div key={item.id} className="criteria-card-full">
                          <label className="criteria-heading" htmlFor={`${safeId}-select`}>
                            {index + 1}. {item.title}
                          </label>

                          <fieldset
                            id={`${safeId}-select`}
                            className="statement-options-full"
                            aria-label={`Select evaluation for ${item.title}`}
                          >
                            {Object.entries(item.levels).map(([level, statement]) => (
                              <label
                                key={level}
                                className={`option statement-option ${scores[item.id] === parseInt(level) ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={safeId}
                                  value={level}
                                  checked={scores[item.id] === parseInt(level)}
                                  onChange={(e) => handleScoreChange(item.id, e.target.value)}
                                />
                                <span className="option-circle" aria-hidden="true"></span>
                                <span className="option-content">
                                  <span className="option-level">Level {level}</span>
                                  <span className="statement-text">{statement}</span>
                                </span>
                              </label>
                            ))}
                          </fieldset>
                          
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '16px', marginBottom: '16px' }}>
                            Question {activeCriteriaIndex + 1} of {criteriaData.length}
                          </div>

                          <div className="criteria-navigation">
                            <button
                              type="button"
                              onClick={handlePreviousCriteria}
                              disabled={activeCriteriaIndex === 0}
                              className="btn-nav btn-nav-prev"
                              title="Go to previous question"
                            >
                              ← Previous
                            </button>
                            {activeCriteriaIndex < criteriaData.length - 1 && (
                              <button
                                type="button"
                                onClick={handleNextCriteria}
                                disabled={!scores[item.id]}
                                className="btn-nav btn-nav-next"
                                title="Go to next question"
                              >
                                Next →
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </section>
              )}

              {submitMessage.text && (
                <div className={submitMessage.type === 'error' ? 'error-message' : 'success'}>
                  {submitMessage.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < submitMessage.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {isContactNumberValid && (
                <button type="submit" className="btn print-hide" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </button>
              )}

            </form>
          )}

          {isSubmitted && (
            <section ref={scorecardRef} className="card scorecard-section">
              <div className="scorecard-topbar">
                <div className="scorecard-heading-box">
                  <div className="scorecard-badge">Eco Meter Report</div>
                  <h2 className="scorecard-main-title">School Assessment Summary</h2>
                  <p className="scorecard-subtitle">A polished, professional summary of the selected levels across all assessment aspects.</p>
                </div>
              </div>

              <div className="scorecard-school-download-section">
                <div className="scorecard-school-info-box">
                  <div className="school-info-top">
                    <div className="school-info-icon">🏫</div>
                    <div>
                      <span className="school-label">School Name</span>
                      <span className="school-value">{schoolName}</span>
                    </div>
                  </div>
                  <div className="school-meta-row">
                    <span className="school-meta-pill"><strong>State:</strong> {selectedState}</span>
                    <span className="school-meta-pill"><strong>Cluster:</strong> {selectedCluster}</span>
                    <span className="school-meta-pill"><strong>Zone:</strong> {selectedZone}</span>
                    <span className="school-meta-pill"><strong>District:</strong> {selectedDistrict}</span>
                    <span className="school-meta-pill"><strong>Role:</strong> {role}</span>
                    <span className="school-meta-pill"><strong>Date:</strong> {evaluationDate}</span>
                  </div>
                </div>
                <button onClick={handleDownloadPdf} className="btn-download-pdf print-hide" type="button">
                  📄 Download Report
                </button>
              </div>

              <div className="scorecard-summary-grid">
                <div className="summary-card summary-card-primary">
                  <div className="summary-card-icon">📈</div>
                  <span className="summary-card-label">Overall Score</span>
                  <div className="summary-card-value">{overallPercentage}%</div>
                  <div className="summary-card-meta">{completedCriteriaCount}/{criteriaData.length} aspects completed</div>
                  <div className="summary-progress">
                    <div className="summary-progress-bar">
                      <span style={{ width: `${overallPercentage}%` }} />
                    </div>
                  </div>
                </div>
                <div className="summary-card summary-card-success">
                  <div className="summary-card-icon">✅</div>
                  <span className="summary-card-label">Average Level</span>
                  <div className="summary-card-value">{averageScore}/4</div>
                  <div className="summary-card-meta">Performance band: {overallBand}</div>
                </div>
                <div className="summary-card summary-card-accent">
                  <div className="summary-card-icon">🌟</div>
                  <span className="summary-card-label">Highest Achieved</span>
                  <div className="summary-card-value">{highestLevel.score ? getGrade(highestLevel.score) : '—'}</div>
                  <div className="summary-card-meta">{highestLevel.title}</div>
                </div>
              </div>

              <div className="scorecard-insights-grid">
                <div className="insight-card performance-card">
                  <h3 className="insight-title">Performance Snapshot</h3>
                  <div className="performance-score">{overallPercentage}%</div>
                  <p className="performance-copy">Overall score across all assessed aspects</p>
                  <div className="performance-stats">
                    <span><strong>{completedCriteriaCount}/{criteriaData.length}</strong> rated</span>
                    <span><strong>{averageScore}/4</strong> average</span>
                  </div>
                  <span className="performance-band">{overallBand}</span>
                </div>

                <div className="insight-card">
                  <h3 className="insight-title">Strengths</h3>
                  <div className="insight-list">
                    {strengths.map((item) => (
                      <div className="insight-row" key={`strength-${item.id}`}>
                        <strong>{item.title}</strong>
                        <span>{item.grade} · Level {item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-card">
                  <h3 className="insight-title">Focus Areas</h3>
                  <div className="insight-list">
                    {focusAreas.map((item) => (
                      <div className="insight-row" key={`focus-${item.id}`}>
                        <strong>{item.title}</strong>
                        <span>{item.grade} · Level {item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="scorecard-table-section">
                <div className="scorecard-table-header">
                  <h3 className="scorecard-table-heading">Detailed aspect-wise review</h3>
                  <span className="scorecard-table-caption">Each row highlights the selected level and the stated standard for that criterion.</span>
                </div>
                <div className="scorecard-table-wrapper">
                  <table className="scorecard-table">
                    <thead>
                      <tr>
                        <th>Aspect</th>
                        <th>Selected Level</th>
                        <th>Review Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criteriaData.map((item) => {
                        const selectedScore = scores[item.id];
                        const selectedGrade = getGrade(selectedScore);
                        const selectedStatement = selectedScore ? item.levels[selectedScore] : 'Awaiting response';

                        return (
                          <tr key={item.id} className={selectedScore ? 'selected-row' : 'pending-row'}>
                            <td className="aspect-cell">{item.title}</td>
                            <td className="level-cell">
                              <span className={`selected-grade selected-grade-${selectedScore || 'empty'}`}>
                                {selectedScore ? `${selectedGrade} · L${selectedScore}` : 'Pending'}
                              </span>
                            </td>
                            <td className="statement-cell">
                              <div className="statement-preview">{selectedStatement}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="scorecard-chart-section">
                <div className="scorecard-chart-header">Aspect-wise level chart</div>
                <div className="scorecard-chart-legend">Grade scale: B reaches 25, B+ reaches 50, A reaches 75, and A+ reaches 100.</div>
                <div className="scorecard-chart">
                  <div className="scorecard-chart-axis" aria-hidden="true">
                    <span>A+ 100</span>
                    <span>A 75</span>
                    <span>B+ 50</span>
                    <span>B 25</span>
                    <span>0</span>
                  </div>
                  <div className="scorecard-chart-bars">
                    {criteriaData.map((item) => {
                      const selectedScore = scores[item.id] || 0;
                      const selectedGrade = selectedScore ? getGrade(selectedScore) : 'No selection';
                      const barHeight = getLevelPercent(selectedScore);
                      const levelText = selectedScore ? `Level ${selectedScore}` : 'Not rated';

                      return (
                        <div key={item.id} className="chart-bar-column">
                          <div className="chart-bar-wrapper">
                            <div
                              className={`chart-bar-fill chart-bar-${selectedScore}`}
                              style={{ height: `${barHeight}%` }}
                              title={`${item.title}: ${selectedGrade} (${levelText})`}
                              aria-label={`${item.title}: ${selectedGrade} (${levelText})`}
                              data-tooltip={`${item.title}: ${selectedGrade} (${levelText})`}
                              data-grade={selectedGrade}
                            ></div>
                          </div>
                          <div className="chart-bar-grade">{selectedScore ? `${selectedGrade}` : '—'}</div>
                          <div className="chart-bar-level">{levelText}</div>
                          <div className="chart-bar-aspect" title={item.title}>{item.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
