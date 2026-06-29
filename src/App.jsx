import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase, SUPABASE_TABLE } from './config/supabaseClient';
import dseLogo from './assets/dse.png';
import iecLogo from './assets/iec.png';
import jmcLogo from './assets/jmc.png';

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
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // 1. Fetch School List from Google Sheets
  useEffect(() => {
    // âš ï¸ REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
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

  const states = Object.keys(hierarchy).sort();
  const districts = selectedState && hierarchy[selectedState] ? Object.keys(hierarchy[selectedState]).sort() : [];
  const zones = selectedDistrict && hierarchy[selectedState]?.[selectedDistrict] ? Object.keys(hierarchy[selectedState][selectedDistrict]).sort() : [];
  const clusters = selectedZone && hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone] ? Object.keys(hierarchy[selectedState][selectedDistrict][selectedZone]).sort() : [];
  const schoolsForSelection = selectedCluster && hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone]?.[selectedCluster] ? hierarchy[selectedState][selectedDistrict][selectedZone][selectedCluster].sort() : [];
  const isContactNumberValid = /^[6-9]\d{9}$/.test(contactNumber.trim());
  const visibleCriteria = criteriaData.slice(0, isContactNumberValid ? activeCriteriaIndex + 1 : 0);
  const allCriteriaScored = criteriaData.every(c => scores[c.id] !== undefined);
  const totalQuestions = 19;
  const completedQuestions = [
    selectedState,
    selectedDistrict,
    selectedZone,
    selectedCluster,
    schoolName,
    role,
    evaluatorName.trim(),
    evaluationDate,
    isContactNumberValid ? contactNumber : ''
  ].filter(Boolean).length + Object.keys(scores).length;
  const currentQuestion = Math.min(completedQuestions + 1, totalQuestions);
  const progressPercent = Math.min((completedQuestions / totalQuestions) * 100, 100);

  const handleScoreChange = (criteriaId, value) => {
    setScores(prev => ({ ...prev, [criteriaId]: parseInt(value) }));
    setIsSubmitted(false);

    const selectedCriteriaIndex = criteriaData.findIndex(c => c.id === criteriaId);

    if (selectedCriteriaIndex === activeCriteriaIndex && selectedCriteriaIndex < criteriaData.length - 1) {
      setActiveCriteriaIndex(selectedCriteriaIndex + 1);
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
            <h2>Saving...</h2>
            <p>Please wait while your evaluation is being submitted.</p>
          </div>
        </div>
      )}
        
        <div className="container">
          <div className="container">
      
            {/* Header Section - Banner Style */}
            <header className="header-banner">
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
          <form onSubmit={handleSubmit}>
            <section className="card school-info-card">
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

            {/* Scorecard Section - Light Blue background with boxed school name */}
            <section className="card scorecard-section">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Scorecard</h2>
                  <p className="card-subtitle">Overview of selected school</p>
                </div>
              </div>

              <div className="scorecard-content">
                <div className="scorecard-box">
                  <div className="scorecard-label">Selected School</div>
                  <div className="scorecard-school-name">{schoolName || 'No school selected'}</div>
                </div>
              </div>
            </section>

            {isContactNumberValid && (
                <section className="card">
                  <h2 className="card-title card-section-title">
                    Specific Criteria Evaluation
                  </h2>

                  <div className="criteria-list">
                    {visibleCriteria.map((item, index) => {
                      const safeId = item.id.replace(/\s+/g, '-').toLowerCase();

                      return (
                        <div key={item.id} className="criteria-card">
                          <label className="criteria-heading" htmlFor={`${safeId}-select`}>
                            {index + 1}. {item.title}
                          </label>

                          <fieldset
                            id={`${safeId}-select`}
                            className="statement-options"
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
                                <span>
                                  <span className="statement-text">{statement}</span>
                                </span>
                              </label>
                            ))}
                          </fieldset>
                        </div>
                      );
                    })}
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

              {isContactNumberValid && allCriteriaScored && !isSubmitted && (
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </button>
              )}

          </form>

          {isSubmitted && (
            <section className="card scorecard-section">
              <div className="card-header scorecard-header">
                <div>
                  <h2 className="card-title">Scorecard</h2>
                  <p className="card-subtitle">
                   
                  </p>
                </div>
              </div>

              <div className="school-scorecard">
                <div className="school-scorecard-info">
                  <span className="scorecard-label"></span>
                  <h3 className="scorecard-school-name">{schoolName}</h3>

                  <div className="scorecard-meta">

                  </div>
                </div>

                <div className="scorecard-total">
                  <span className="scorecard-label">Total Score</span>
                  <strong>
                    {criteriaData.reduce((sum, item) => sum + (scores[item.id] || 0), 0)}
                  </strong>
                  <span>out of {criteriaData.length * 4}</span>
                </div>

                <div className="scorecard-progress">
                  <div className="scorecard-progress-head">
                    <span>Overall Performance</span>
                    <strong>
                      {Math.round(
                        (criteriaData.reduce((sum, item) => sum + (scores[item.id] || 0), 0) /
                          (criteriaData.length * 4)) *
                          100
                      )}
                      %
                    </strong>
                  </div>
                  <div className="scorecard-progress-track">
                    <div
                      className="scorecard-progress-fill"
                      style={{
                        width: `${Math.round(
                          (criteriaData.reduce((sum, item) => sum + (scores[item.id] || 0), 0) /
                            (criteriaData.length * 4)) *
                            100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="result-grid">
                {criteriaData.map(item => (
                  <article key={item.id} className="result-card">
                    <div className="result-card-head">
                      <h3 className="result-heading">{item.title}</h3>
                      <span className="result-score-badge">
                        {scores[item.id]}/4
                      </span>
                    </div>
                    <p className="result-text">{item.levels[scores[item.id]]}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Aspect-wise Output</h2>
              </div>

              <div className="result-grid">
                {criteriaData.map(item => (
                  <article key={item.id} className="result-card">
                    <h3 className="result-heading">{item.title}</h3>
                    <p className="result-text">{item.levels[scores[item.id]]}</p>
                  </article>
                ))}
              </div>
            </section>
          )

        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
