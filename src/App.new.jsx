import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [nodalTeacherName, setNodalTeacherName] = useState('');
  const [nodalTeacherContact, setNodalTeacherContact] = useState('');
  const [confirmingPersonName, setConfirmingPersonName] = useState('');
  const [confirmingPersonRole, setConfirmingPersonRole] = useState('');
  const [confirmingPersonCustomRole, setConfirmingPersonCustomRole] = useState('');
  const [confirmingPersonMobile, setConfirmingPersonMobile] = useState('');
  const [discussionConductedWithName, setDiscussionConductedWithName] = useState('');
  const [discussionConductedWithRole, setDiscussionConductedWithRole] = useState('');
  const [occasionOfFormFilling, setOccasionOfFormFilling] = useState('');
  const [occasionOfFormFillingOther, setOccasionOfFormFillingOther] = useState('');
  const [studentsCount, setStudentsCount] = useState('');
  const [smcMembersCount, setSmcMembersCount] = useState('');
  const [teachersCount, setTeachersCount] = useState('');
  const [parentsCount, setParentsCount] = useState('');
  const [anganwadiTeachersCount, setAnganwadiTeachersCount] = useState('');
  const [zonalCoordinatorsCount, setZonalCoordinatorsCount] = useState('');
  const [schoolList, setSchoolList] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [schoolLoadError, setSchoolLoadError] = useState('');
  const [scores, setScores] = useState({});
  const [activeCriteriaIndex, setActiveCriteriaIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const schoolSelectionRef = useRef(null);
  const criteriaSectionRef = useRef(null);

  const states = Object.keys(hierarchy);
  const districts = selectedState ? Object.keys(hierarchy[selectedState] || {}) : [];
  const zones = selectedDistrict ? Object.keys(hierarchy[selectedState]?.[selectedDistrict] || {}) : [];
  const clusters = selectedZone ? Object.keys(hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone] || {}) : [];
  const schoolsForSelection = selectedCluster ? (hierarchy[selectedState]?.[selectedDistrict]?.[selectedZone]?.[selectedCluster] || []) : [];

  const isContactNumberValid = /^[6-9]\d{9}$/.test(confirmingPersonMobile.trim());
  const selectedOccasion = occasionOfFormFilling === 'Other' ? occasionOfFormFillingOther.trim() : occasionOfFormFilling;

  useEffect(() => {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwm5vTN_1K7EsC7Vr9nWH3RrT1tEXwRitKccKVvB-1x6JI3VzSobOh7q4sh_7GQCXP7/exec";

    fetch(scriptUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Unexpected school data format');
        }

        const built = {};
        data.forEach((row) => {
          const state = (row.state || row.State || '').trim();
          const district = (row.district || row.District || '').trim();
          const zone = (row.zone || row.Zone || '').trim();
          const cluster = (row.cluster || row.Cluster || '').trim();
          const school = (row.schoolName || row.school || row.School || '').trim();

          if (!state || !district || !zone || !cluster || !school) {
            return;
          }

          built[state] = built[state] || {};
          built[state][district] = built[state][district] || {};
          built[state][district][zone] = built[state][district][zone] || {};
          built[state][district][zone][cluster] = built[state][district][zone][cluster] || [];

          if (!built[state][district][zone][cluster].includes(school)) {
            built[state][district][zone][cluster].push(school);
          }
        });

        setHierarchy(built);
        setSchoolList(data);
      })
      .catch((error) => {
        console.error(error);
        setSchoolLoadError('Unable to load school data.');
      })
      .finally(() => {
        setIsLoadingSchools(false);
      });
  }, []);

  const resetSelection = () => {
    setSelectedDistrict('');
    setSelectedZone('');
    setSelectedCluster('');
    setSchoolName('');
  };

  const safeNumberInput = (setter) => (event) => {
    setter(event.target.value.replace(/[^0-9]/g, ''));
  };

  const handleScoreChange = (criterionId, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: parseInt(value, 10),
    }));
  };

  const handlePreviousCriteria = () => {
    setActiveCriteriaIndex((current) => Math.max(0, current - 1));
  };

  const handleNextCriteria = () => {
    setActiveCriteriaIndex((current) => Math.min(criteriaData.length - 1, current + 1));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitMessage({ type: 'success', text: 'Form submitted successfully.' });
    setIsSubmitted(true);
  };

  const getGrade = (score) => {
    if (score === 4) return 'A+';
    if (score === 3) return 'A';
    if (score === 2) return 'B+';
    if (score === 1) return 'B';
    return 'Pending';
  };

  const getLevelPercent = (score) => {
    if (!score) return 0;
    return Math.round((score / 4) * 100);
  };

  const completedCriteriaCount = Object.values(scores).filter(Boolean).length;
  const totalCriteriaScore = Object.values(scores).reduce((sum, value) => sum + (value || 0), 0);
  const overallPercentage = completedCriteriaCount ? Math.round((totalCriteriaScore / (criteriaData.length * 4)) * 100) : 0;
  const averageScore = completedCriteriaCount ? (totalCriteriaScore / completedCriteriaCount).toFixed(1) : '0.0';

  const highestLevel = (() => {
    const scoredEntries = Object.entries(scores).filter(([, value]) => value);
    if (!scoredEntries.length) {
      return { score: 0, title: 'No criteria selected' };
    }

    const [bestId, bestScore] = scoredEntries.reduce((best, current) => {
      return current[1] > best[1] ? current : best;
    }, scoredEntries[0]);

    const matching = criteriaData.find((item) => item.id === bestId);
    return {
      score: bestScore,
      title: matching ? matching.title : bestId,
    };
  })();

  const strengths = criteriaData
    .filter((item) => scores[item.id] === 4)
    .map((item) => ({
      id: item.id,
      title: item.title,
      score: scores[item.id],
      grade: getGrade(scores[item.id]),
    }));

  const focusAreas = criteriaData
    .filter((item) => scores[item.id] && scores[item.id] < 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      score: scores[item.id],
      grade: getGrade(scores[item.id]),
    }));

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>Eco Meter Survey</h1>
          <p>Please complete each step to continue.</p>
        </header>

        <main className="app-main">
          <form onSubmit={handleSubmit} className="print-hide">
            <section className="card school-info-card" ref={schoolSelectionRef}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">School Selection</h2>
                  <p className="card-subtitle">Follow the steps to select your school from the list.</p>
                </div>
              </div>

              <div className="school-selection-fields">
                <div className="school-field-item">
                  <label className="school-field-label">State</label>
                  {isLoadingSchools ? (
                    <p className="loading-text">Loading school data...</p>
                  ) : schoolLoadError ? (
                    <p className="error-text">{schoolLoadError}</p>
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
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select State --
                      </option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
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
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select District --
                      </option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
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
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select Zone --
                      </option>
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
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
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select Cluster --
                      </option>
                      {clusters.map((cluster) => (
                        <option key={cluster} value={cluster}>
                          {cluster}
                        </option>
                      ))}
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
                        setCurrentStep(1);
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select School --
                      </option>
                      {schoolsForSelection.map((school, index) => (
                        <option key={`${school}-${index}`} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </section>

            {currentStep === 1 && schoolName && (
              <section className="card" aria-label="Nodal Teacher Details">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Nodal Teacher Details</h2>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nodalTeacherName">Nodal Teacher Name</label>
                    <input
                      id="nodalTeacherName"
                      className="form-control"
                      type="text"
                      value={nodalTeacherName}
                      onChange={(e) => setNodalTeacherName(e.target.value)}
                      placeholder="Enter Nodal Teacher Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nodalTeacherContact">Nodal Teacher Contact</label>
                    <input
                      id="nodalTeacherContact"
                      className="form-control"
                      type="tel"
                      value={nodalTeacherContact}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setNodalTeacherContact(cleaned);
                        if (cleaned.length === 10) {
                          setCurrentStep(2);
                        }
                      }}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                      required
                    />
                  </div>
                </div>

                <div className="step-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(0)}>
                    ← Back
                  </button>
                </div>
              </section>
            )}

            {currentStep === 2 && nodalTeacherContact.length === 10 && (
              <section className="card" aria-label="Confirming Person">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Who is confirming this information?</h2>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="confirmingPersonName">Name</label>
                    <input
                      id="confirmingPersonName"
                      className="form-control"
                      type="text"
                      value={confirmingPersonName}
                      onChange={(e) => setConfirmingPersonName(e.target.value)}
                      placeholder="Enter Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmingPersonRole">Role / Designation</label>
                    <select
                      id="confirmingPersonRole"
                      className="form-control"
                      value={confirmingPersonRole}
                      onChange={(e) => {
                        setConfirmingPersonRole(e.target.value);
                        if (e.target.value !== 'Other') {
                          setConfirmingPersonCustomRole('');
                        }
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select Role --
                      </option>
                      <option value="HOI">HOI</option>
                      <option value="Nodal Teacher">Nodal Teacher</option>
                      <option value="SMC Precedence">SMC Precedence</option>
                      <option value="Eco Club Member">Eco Club Member</option>
                      <option value="Local Influencer">Local Influencer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {confirmingPersonRole === 'Other' && (
                    <div className="form-group">
                      <label htmlFor="confirmingPersonOtherRole">Please specify Role / Designation</label>
                      <input
                        id="confirmingPersonOtherRole"
                        className="form-control"
                        type="text"
                        value={confirmingPersonCustomRole}
                        onChange={(e) => setConfirmingPersonCustomRole(e.target.value)}
                        placeholder="Enter your custom role"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="confirmingPersonMobile">Mobile Number</label>
                    <input
                      id="confirmingPersonMobile"
                      className="form-control"
                      type="tel"
                      value={confirmingPersonMobile}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setConfirmingPersonMobile(cleaned);
                        if (cleaned.length === 10) {
                          setCurrentStep(3);
                        }
                      }}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                      required
                    />
                  </div>
                </div>
                <div className="step-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                    ← Back
                  </button>
                </div>
              </section>
            )}

            {currentStep === 3 && confirmingPersonMobile.length === 10 && (
              <section className="card" aria-label="Discussion and Occasion">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Discussion and Occasion</h2>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="discussionConductedWithName">Discussion Conducted With - Name</label>
                    <input
                      id="discussionConductedWithName"
                      className="form-control"
                      type="text"
                      value={discussionConductedWithName}
                      onChange={(e) => setDiscussionConductedWithName(e.target.value)}
                      placeholder="Enter Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="discussionConductedWithRole">Role</label>
                    <input
                      id="discussionConductedWithRole"
                      className="form-control"
                      type="text"
                      value={discussionConductedWithRole}
                      onChange={(e) => setDiscussionConductedWithRole(e.target.value)}
                      placeholder="Enter Role"
                      required
                    />
                  </div>
                </div>

                <hr className="section-divider" />

                <div className="card-header">
                  <div>
                    <h2 className="card-title">Occasion of Form Filling</h2>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="occasionOfFormFilling">Select Occasion</label>
                    <select
                      id="occasionOfFormFilling"
                      className="form-control"
                      value={occasionOfFormFilling}
                      onChange={(e) => {
                        setOccasionOfFormFilling(e.target.value);
                        setOccasionOfFormFillingOther('');
                      }}
                      required
                    >
                      <option value="" disabled>
                        -- Select Occasion --
                      </option>
                      <option value="During Monthly SMC Meeting">During Monthly SMC Meeting</option>
                      <option value="Other">Other (Please specify)</option>
                    </select>
                  </div>

                  {occasionOfFormFilling === 'Other' && (
                    <div className="form-group">
                      <label htmlFor="occasionOfFormFillingOther">Please specify</label>
                      <input
                        id="occasionOfFormFillingOther"
                        className="form-control"
                        type="text"
                        value={occasionOfFormFillingOther}
                        onChange={(e) => setOccasionOfFormFillingOther(e.target.value)}
                        placeholder="Enter occasion"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="card-header">
                  <div>
                    <h2 className="card-title">Participation in SMC Meeting</h2>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="studentsCount">Students (number)</label>
                    <input
                      id="studentsCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={studentsCount}
                      onChange={safeNumberInput(setStudentsCount)}
                      placeholder="Enter number of students"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="smcMembersCount">SMC Members (number)</label>
                    <input
                      id="smcMembersCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={smcMembersCount}
                      onChange={safeNumberInput(setSmcMembersCount)}
                      placeholder="Enter number of SMC members"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="teachersCount">Teachers (number)</label>
                    <input
                      id="teachersCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={teachersCount}
                      onChange={safeNumberInput(setTeachersCount)}
                      placeholder="Enter number of teachers"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="parentsCount">Parents (number)</label>
                    <input
                      id="parentsCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={parentsCount}
                      onChange={safeNumberInput(setParentsCount)}
                      placeholder="Enter number of parents"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="anganwadiTeachersCount">Anganwadi Teachers (number)</label>
                    <input
                      id="anganwadiTeachersCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={anganwadiTeachersCount}
                      onChange={safeNumberInput(setAnganwadiTeachersCount)}
                      placeholder="Enter number of Anganwadi teachers"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zonalCoordinatorsCount">Zonal Coordinators (number)</label>
                    <input
                      id="zonalCoordinatorsCount"
                      className="form-control"
                      type="number"
                      min="0"
                      value={zonalCoordinatorsCount}
                      onChange={safeNumberInput(setZonalCoordinatorsCount)}
                      placeholder="Enter number of zonal coordinators"
                    />
                  </div>
                </div>

                <div className="step-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(4)}
                    disabled={
                      !discussionConductedWithName.trim() ||
                      !discussionConductedWithRole.trim() ||
                      !selectedOccasion
                    }
                  >
                    Continue to Criteria
                  </button>
                </div>
              </section>
            )}

            {currentStep === 4 && isContactNumberValid && selectedOccasion && (
              <section className="card" ref={criteriaSectionRef}>
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Specific Criteria Evaluation</h2>
                  </div>
                </div>
                <div className="criteria-list-single">
                  {(() => {
                    const item = criteriaData[activeCriteriaIndex];
                    const safeId = item.id.replace(/\s+/g, '-').toLowerCase();

                    return (
                      <div key={item.id} className="criteria-card-full">
                        <label className="criteria-heading" htmlFor={`${safeId}-select`}>
                          {activeCriteriaIndex + 1}. {item.title}
                        </label>

                        <fieldset
                          id={`${safeId}-select`}
                          className="statement-options-full"
                          aria-label={`Select evaluation for ${item.title}`}
                        >
                          {Object.entries(item.levels).map(([level, statement]) => (
                            <label
                              key={level}
                              className={`option statement-option ${scores[item.id] === parseInt(level, 10) ? 'selected' : ''}`}
                            >
                              <input
                                type="radio"
                                name={safeId}
                                value={level}
                                checked={scores[item.id] === parseInt(level, 10)}
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

                        <div className="question-progress-text">
                          Question {activeCriteriaIndex + 1} of {criteriaData.length}
                        </div>

                        <div className="criteria-navigation">
                          <button
                            type="button"
                            onClick={handlePreviousCriteria}
                            disabled={activeCriteriaIndex === 0}
                            className="btn-nav btn-nav-prev"
                          >
                            ← Previous
                          </button>
                          {activeCriteriaIndex < criteriaData.length - 1 && (
                            <button
                              type="button"
                              onClick={handleNextCriteria}
                              disabled={!scores[item.id]}
                              className="btn-nav btn-nav-next"
                            >
                              Next →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="step-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                    ← Back
                  </button>
                </div>
              </section>
            )}

            {submitMessage.text && (
              <div className={submitMessage.type === 'error' ? 'error-message' : 'success'}>
                {submitMessage.text}
              </div>
            )}

            {currentStep === 4 && isContactNumberValid && (
              <button type="submit" className="btn btn-primary" disabled={isSubmitted}>
                {isSubmitted ? 'Saved' : 'Submit'}
              </button>
            )}
          </form>

          {isSubmitted && (
            <section className="card scorecard-section" ref={schoolSelectionRef}>
              <div className="scorecard-topbar">
                <div className="scorecard-heading-box">
                  <div className="scorecard-badge">Eco Meter Report</div>
                  <h2 className="scorecard-main-title">School Assessment Summary</h2>
                  <p className="scorecard-subtitle">A summary of the selected scores across assessment aspects.</p>
                </div>
              </div>

              <div className="scorecard-summary-grid">
                <div className="summary-card summary-card-primary">
                  <div className="summary-card-icon">📈</div>
                  <span className="summary-card-label">Overall Score</span>
                  <div className="summary-card-value">{overallPercentage}%</div>
                  <div className="summary-card-meta">{completedCriteriaCount}/{criteriaData.length} aspects completed</div>
                </div>
                <div className="summary-card summary-card-success">
                  <div className="summary-card-icon">✅</div>
                  <span className="summary-card-label">Average Level</span>
                  <div className="summary-card-value">{averageScore}/4</div>
                </div>
                <div className="summary-card summary-card-accent">
                  <div className="summary-card-icon">🌟</div>
                  <span className="summary-card-label">Highest Achieved</span>
                  <div className="summary-card-value">{highestLevel.score ? getGrade(highestLevel.score) : '—'}</div>
                  <div className="summary-card-meta">{highestLevel.title}</div>
                </div>
              </div>

              <div className="scorecard-meta-list">
                <div><strong>School:</strong> {schoolName}</div>
                <div><strong>State:</strong> {selectedState}</div>
                <div><strong>District:</strong> {selectedDistrict}</div>
                <div><strong>Zone:</strong> {selectedZone}</div>
                <div><strong>Cluster:</strong> {selectedCluster}</div>
                <div><strong>Nodal Teacher:</strong> {nodalTeacherName}</div>
                <div><strong>Confirming Person:</strong> {confirmingPersonName}</div>
                <div><strong>Occasion:</strong> {selectedOccasion}</div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
