import React, { useState } from 'react';

// Eco-Meter 10 Criteria and their specific level statements[cite: 1, 2]
const criteriaData = [
  {
    id: "Safe Drinking Water",
    title: "Safe Drinking Water",
    levels: {
      1: "1. No contamination in the water source. 2. Storage or distribution of drinking water, Students need to have awareness of safe drinking water.",
      2: "1. Good source of water & storage is done in a clean way. 2. 40-60% students have awareness about drinking water.",
      3: "1. The school has high standards of water storage. 2. 70-80% students have awareness about safe drinking water.",
      4: "1. Good mechanism of source protection, storage & distribution. 2. Have a system of continuous assessment & review of safe drinking water. 3. All students are aware about Safe Drinking Water."
    }
  },
  {
    id: "Clean Toilets",
    title: "Clean Toilets",
    levels: {
      1: "1. Need for a basic toilet facility. 2. Need for awareness about clean toilets.",
      2: "1. Basic Toliet Facility available. 2. Need to ensure basic maintenance. 3. 40-60% students have awareness about clean toilets.",
      3: "1. The school has clean toilets. 2. Toilets are fully functional with all the necessary aspects in place. 3. 70- 80% students are aware about clean toilets.",
      4: "1. The school has clean & hygienic toilets. 2. Has high standards for cleanliness with an efficient system of assessment, review of the toilet maintenance. 3. All students are aware about clean toilets."
    }
  },
  {
    id: "Personal Hygiene",
    title: "Personal Hygiene",
    levels: {
      1: "1. Students need information and understanding about personal hygiene.",
      2: "1. 40-60% students are aware of the need for personal hygiene.",
      3: "1. 70-80% students have a clear understanding of personal hygiene.",
      4: "1. The schools has clear guidelines for the following of personal hygiene practices. 2. Ensures adherence in a sensitive manner."
    }
  },
  {
    id: "Clean Classroom",
    title: "Clean Classrooms",
    levels: {
      1: "1. Classrooms require major re-organisation and maintenance.",
      2: "1. Basic maintenance is ensured across classrooms.",
      3: "1. Most (70-80%) of the classrooms in the schools are well-organised and well-maintained.",
      4: "1. School has an overall standards & guidelines for clean classrooms and follows a 5S process: Sort, Set in order, Shine, Standardize, Sustain."
    }
  },
  {
    id: "School Campus",
    title: "School Premises",
    levels: {
      1: "1. Students need awareness about clean & well-maintained school premises. 2. Campus is in need of basic maintenance and a compound wall.",
      2: "1. School premises has been kept litter-free but needs more attention in other aspects.",
      3: "1. School is litter-free. 2. It has an effective waste-disposal mechanism. 3. All the unused material and debris are properly organised. 4. The sewage system is clean. 5. Ground is maintained well to avoid water-clogging.",
      4: "1. All the areas in the school are well-maintained. 2. The school has a clear guideline and review mechanism to maintain a clean campus. 3. All students having a high level of awareness for a clean & green campus."
    }
  },
  {
    id: "Waste Management",
    title: "Solid Waste Management",
    levels: {
      1: "1. Students need to have awareness about the importance of solid waste management & the need for compost pits.",
      2: "1. School has created two compost pits but it needs to be used effectively. 2. 40-60% students are aware.",
      3: "1. Solid waste is being segregated effectively in the pits created. 2. 70-80% students are aware about Solid waste management.",
      4: "1. The school is able to generate a sizable quantity of good quality compost. 2. All students are aware about the need for solid waste management."
    }
  },
  {
    id: "School Vegetable Garden",
    title: "School Vegetable Garden",
    levels: {
      1: "1. Students need to be aware about the use of school vegetable garden. 2. School needs to find a specific place to initiate the School Vegetable Garden.",
      2: "1. 40-60% students are aware. 2. School has a space for school vegetable garden and they have started preliminary activities.",
      3: "1. 70-80% students have an awareness about school vegetable garden. 2. The School Vegetable Garden is well-maintained and vegetables are used for mid-day meals.",
      4: "1. Students have a good understanding of nutritional value. 2. Definite plan for a toxin-free garden. 3. Clear strategy for year-round use in mid-day meals."
    }
  },
  {
    id: "Tree Planting",
    title: "Tree Planting",
    levels: {
      1: "1. Students need to be aware about the need for tree-planting. 2. School needs to identify a specific place for tree-planting.",
      2: "1. 40-60% students are aware about the need for tree-planting. 2. School has a space and initiated planting.",
      3: "1. 70-80% students have an awareness. 2. The school is implementing tree-planting activities on a regular basis.",
      4: "1. The school has a clear plan for tree-planting activities in the neighborhood. 2. Actively involved with the SMC."
    }
  },
  {
    id: "Upcycling",
    title: "Upcycling-Recycling",
    levels: {
      1: "1. Students need to be aware of the concept of upcycling and recycling of materials.",
      2: "1. 40-60% students are aware about upcycling. 2. Students have initiated recycling and upcycling activities.",
      3: "1. 70-80% students are aware about the concept. 2. Students have created products for demonstration & display.",
      4: "1. The school has clear guidelines for upcycling and recycling activities. 2. Students are actively involved in these activities on a regular basis."
    }
  },
  {
    id: "Plastic Free Campus",
    title: "Plastic Free Campus",
    levels: {
      1: "1. School needs to have a plan & strategy for Single Use Plastic (SUP)-free campus. 2. Students need to be aware of SUP.",
      2: "1. The school has started the practice of segregating plastic waste. 2. 40-60% students have an awareness about SUP.",
      3: "1. 70-80% students are aware of SUP-free campus. 2. The school has a clear plan for SUP campus & are actively ensuring maintenance.",
      4: "1. The school has declared itself as a plastic-free campus. 2. The school is actively reaching out to the local community to promote the initiative."
    }
  }
];

function App() {
  const [schoolName, setSchoolName] = useState("");
  const [evaluatorName, setEvaluatorName] = useState("");
  
  // Initialize scores with Level 1 for all criteria
  const [scores, setScores] = useState(
    criteriaData.reduce((acc, curr) => ({ ...acc, [curr.id]: 1 }), {})
  );
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScoreChange = (criteriaId, value) => {
    setScores(prev => ({ ...prev, [criteriaId]: parseInt(value) }));
    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      alert("Please enter the school name first!");
      return;
    }
    
    const finalData = {
      schoolName,
      evaluatorName,
      evaluations: criteriaData.map(c => ({
        criteria: c.title,
        score: scores[c.id],
        statement: c.levels[scores[c.id]]
      }))
    };
    
    console.log("Collected Data:", finalData);
    setIsSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        
        {/* Header Section */}
        <div style={{ backgroundColor: '#145c32', color: 'white', padding: '30px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px' }}>
            🌱 Eco-Meter
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: '0.9' }}>
            CLEAN SCHOOLS - HAPPY SCHOOLS[cite: 1]
          </p>
        </div>

        <div style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            
            {/* School Information Section */}
            {/* School Information Card */}
<div
  style={{
    marginBottom: "40px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  }}
>
  {/* Heading */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "25px",
      borderBottom: "2px solid #eef2f7",
      paddingBottom: "15px",
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          color: "#145c32",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        🏫 School Information
      </h2>

      <p
        style={{
          marginTop: "8px",
          color: "#6c757d",
          fontSize: "15px",
        }}
      >
        Please fill the basic details before starting the Eco Meter
        assessment.
      </p>
    </div>

    <div
      style={{
        background: "#e8f5e9",
        color: "#198754",
        padding: "8px 16px",
        borderRadius: "30px",
        fontWeight: "600",
        fontSize: "14px",
      }}
    >
      STEP 1 OF 2
    </div>
  </div>

  {/* Form */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
      gap: "25px",
    }}
  >
    {/* School Name */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        🏫 School Name *
      </label>

      <input
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="Enter School Name"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
          outline: "none",
          transition: "0.3s",
        }}
      />
    </div>

    {/* Evaluator */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        👤 Evaluator Name
      </label>

      <input
        type="text"
        value={evaluatorName}
        onChange={(e) => setEvaluatorName(e.target.value)}
        placeholder="Enter Evaluator Name"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    </div>

    {/* District */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        🏢 District
      </label>

      <input
        type="text"
        placeholder="Enter District"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />
    </div>

    {/* Block */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        📍 Block
      </label>

      <input
        type="text"
        placeholder="Enter Block"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />
    </div>

    {/* Date */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        📅 Evaluation Date
      </label>

      <input
        type="date"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />
    </div>

    {/* Mobile */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        📞 Contact Number
      </label>

      <input
        type="tel"
        placeholder="Enter Mobile Number"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #d6dce5",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />
    </div>
  </div>
</div>

            {/* Detailed Evaluation Section */}
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '20px', color: '#2c3e50', borderBottom: '2px solid #e9ecef', paddingBottom: '10px', marginBottom: '20px' }}>
                📝 Specific Criteria Evaluation[cite: 2]
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {criteriaData.map(item => (
                  <div key={item.id} style={{ backgroundColor: '#fdfdfd', padding: '20px', borderRadius: '10px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    
                    <label style={{ display: 'block', marginBottom: '15px', color: '#145c32', fontWeight: 'bold', fontSize: '18px' }}>
                      {item.title}
                    </label>
                    
                    {/* Custom Radio Button Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[1, 2, 3, 4].map(level => {
                        const isSelected = scores[item.id] === level;
                        
                        return (
                          <div 
                            key={level}
                            onClick={() => handleScoreChange(item.id, level)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid #198754' : '1px solid #ced4da',
                              backgroundColor: isSelected ? '#eefaf2' : '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* Custom Radio Circle */}
                            <div style={{
                              marginTop: '2px',
                              marginRight: '12px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? '5px solid #198754' : '2px solid #adb5bd',
                              backgroundColor: '#fff',
                              flexShrink: 0,
                              transition: 'all 0.2s ease'
                            }}></div>
                            
                            {/* Option Text */}
                            <span style={{ fontSize: '15px', color: isSelected ? '#145c32' : '#495057', lineHeight: '1.5', fontWeight: isSelected ? '500' : '400' }}>
                              <strong style={{ display: 'block', marginBottom: '4px', color: isSelected ? '#198754' : '#6c757d' }}>Level {level}</strong>
                              {item.levels[level]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #c3e6cb', textAlign: 'center', fontWeight: '500' }}>
                ✅ Evaluation Data for "{schoolName}" has been successfully saved! Check browser console.
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              style={{ width: '100%', padding: '16px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#146c43'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#198754'}
            >
              Save Evaluation Data
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default App;