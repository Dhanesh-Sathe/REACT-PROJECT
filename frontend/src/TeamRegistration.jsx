import React, { useState, useEffect } from 'react';
import './TeamRegistration.css';

function TeamRegistrations() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/registrations')
      .then(async (res) => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response text:', errorText);
          throw new Error(`Network response was not ok, status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTeams = teams.filter(team => {
    const teamName = team.teamName || `${team.leader.firstName} ${team.leader.lastName}'s Team`;
    return teamName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDetailsClick = (team) => {
    setSelectedTeam(selectedTeam?._id === team._id ? null : team);
  };

  if (loading) return <div className="loading">Loading registrations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="registrations-container">
      <h1>All Team Registrations</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by team name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="cards-container">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <TeamCard 
              key={team._id} 
              team={team} 
              onDetailsClick={() => handleDetailsClick(team)}
              isSelected={selectedTeam?._id === team._id}
            />
          ))
        ) : (
          <div>No registrations found.</div>
        )}
      </div>
      {selectedTeam && <DetailsOverlay team={selectedTeam} onClose={() => setSelectedTeam(null)} />}
    </div>
  );
}

function TeamCard({ team, onDetailsClick, isSelected }) {
  return (
    <div className="team-card">
      <div className="card-header">
        <h2>{team.teamName || `${team.leader.firstName} ${team.leader.lastName}'s Team`}</h2>
      </div>
      <div className="card-details">
        <p><strong>Team Leader:</strong> {team.leader.firstName} {team.leader.lastName}</p>
        <p><strong>Team Size:</strong> {team.teamSize}</p>
        <p><strong>Leader Email:</strong> {team.leader.email}</p>
        <button 
          className={`details-btn ${isSelected ? 'active' : ''}`} 
          onClick={onDetailsClick}
        >
          {isSelected ? 'Hide Details' : 'All Details'}
        </button>
      </div>
    </div>
  );
}

function DetailsOverlay({ team, onClose }) {
  return (
    <div className="details-overlay">
      <div className="details-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="payment-section">
          <h3>Payment Details</h3>
          {team.paymentQR && (
            <div className="qr-code">
              <img src={team.paymentQR} alt="Payment QR Code" className="qr-img" />
            </div>
          )}
          {team.paymentScreenshot && (
            <div className="payment-proof">
              <p><strong>Payment Screenshot:</strong></p>
              <img 
                src={team.paymentScreenshot} 
                alt="Payment Screenshot" 
                className="payment-screenshot-img" 
              />
            </div>
          )}
        </div>
        <div className="participant-details">
          <h3>Team Leader Details</h3>
          <p><strong>Name:</strong> {team.leader.firstName} {team.leader.lastName}</p>
          <p><strong>Email:</strong> {team.leader.email}</p>
          <p><strong>Mobile:</strong> {team.leader.mobile}</p>
          <p><strong>Gender:</strong> {team.leader.gender}</p>
          <p><strong>Institute Name:</strong> {team.leader.instituteName}</p>
          <p><strong>Participant Type:</strong> {team.leader.type}</p>
          <p><strong>Course:</strong> {team.leader.course}</p>
          <p><strong>Course Specialization:</strong> {team.leader.courseSpecialization}</p>
          <p><strong>Graduation Year:</strong> {team.leader.graduationYear}</p>
          <p><strong>ACES Member:</strong> {team.leader.isAcesMember ? 'Yes' : 'No'}</p>
          {team.leader.isAcesMember && team.leader.receipt && (
            <div className="receipt">
              <p><strong>Receipt:</strong></p>
              <img src={team.leader.receipt} alt="Leader Receipt" className="receipt-img" />
            </div>
          )}
        </div>
        {team.teamMembers && team.teamMembers.length > 0 && (
          <div className="team-members-details">
            <h3>Team Members Details</h3>
            {team.teamMembers.map((member, idx) => (
              <div key={idx} className="member-details">
                <p><strong>Name:</strong> {member.firstName} {member.lastName}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Mobile:</strong> {member.mobile}</p>
                <p><strong>Gender:</strong> {member.gender}</p>
                <p><strong>Institute Name:</strong> {member.instituteName}</p>
                <p><strong>Participant Type:</strong> {member.type}</p>
                <p><strong>Course:</strong> {member.course}</p>
                <p><strong>Course Specialization:</strong> {member.courseSpecialization}</p>
                <p><strong>Graduation Year:</strong> {member.graduationYear}</p>
                <p><strong>ACES Member:</strong> {member.isAcesMember ? 'Yes' : 'No'}</p>
                {member.isAcesMember && member.receipt && (
                  <div className="receipt">
                    <p><strong>Receipt:</strong></p>
                    <img src={member.receipt} alt={`Member ${idx + 1} Receipt`} className="receipt-img" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamRegistrations;