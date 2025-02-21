import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegistrationForm.css';

const formFields = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
  { 
    name: 'gender', 
    label: 'Gender', 
    type: 'select', 
    options: [
      { value: '', label: 'Select Gender' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ],
    required: true 
  },
  { name: 'instituteName', label: 'Institute Name', type: 'text', required: true },
  { name: 'type', label: 'Participant Type', type: 'text', required: true },
  { name: 'course', label: 'Course', type: 'text', required: true },
  { name: 'courseSpecialization', label: 'Course Specialization', type: 'text', required: true },
  { name: 'graduationYear', label: 'Graduation Year', type: 'number', required: true },
  { name: 'isAcesMember', label: 'Are you an ACES Member?', type: 'checkbox', required: false },
  { name: 'receipt', label: 'Upload Receipt (if ACES Member)', type: 'file', required: false, accept: 'image/*' },
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  gender: '',
  instituteName: '',
  type: '',
  course: '',
  courseSpecialization: '',
  graduationYear: '',
  isAcesMember: false,
  receipt: ''
};

function RegistrationForm() {
  const [leaderData, setLeaderData] = useState(initialFormData);
  const [teamSize, setTeamSize] = useState(2);
  const [teamName, setTeamName] = useState('');
  const [teamMembersData, setTeamMembersData] = useState([{ ...initialFormData }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [filePreview, setFilePreview] = useState({
    leader: null,
    members: Array(3).fill(null),
    paymentScreenshot: null
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState('');

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  const validateForm = () => {
    // Validate leader data
    if (!validateEmail(leaderData.email)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address for the team leader.' });
      return false;
    }

    if (!validateMobile(leaderData.mobile)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number for the team leader.' });
      return false;
    }

    // Validate team members data
    for (let i = 0; i < teamMembersData.length; i++) {
      if (!validateEmail(teamMembersData[i].email)) {
        setSubmitMessage({ type: 'error', text: `Please enter a valid email address for team member ${i + 2}.` });
        return false;
      }
      if (!validateMobile(teamMembersData[i].mobile)) {
        setSubmitMessage({ type: 'error', text: `Please enter a valid 10-digit mobile number for team member ${i + 2}.` });
        return false;
      }
    }

    if (!paymentScreenshot) {
      setSubmitMessage({ type: 'error', text: 'Please upload the payment screenshot.' });
      return false;
    }

    return true;
  };

  const handlePaymentScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setPaymentScreenshot(base64);
        setFilePreview({ ...filePreview, paymentScreenshot: base64 });
      } catch (error) {
        console.error("Error converting payment screenshot to base64:", error);
        setSubmitMessage({ type: 'error', text: 'Error uploading payment screenshot. Please try again.' });
      }
    }
  };

  // Render form fields based on the formFields array
  const renderFormField = (field, value, handleChange, handleFileChange, previewSrc, index = null) => {
    const id = index !== null ? `${field.name}-${index}` : field.name;
    switch (field.type) {
      case 'select':
        return (
          <select
            id={id}
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className="form-select"
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            id={id}
            type="checkbox"
            name={field.name}
            checked={value}
            onChange={handleChange}
            className="form-checkbox"
          />
        );
      case 'file':
        return (
          <div className="file-upload-container">
            <input
              id={id}
              type="file"
              name={field.name}
              onChange={handleFileChange}
              accept={field.accept}
              className="file-input"
            />
            {previewSrc && (
              <div className="file-preview">
                <img src={previewSrc} alt="Receipt Preview" className="preview-image" />
              </div>
            )}
          </div>
        );
      default:
        return (
          <input
            id={id}
            type={field.type}
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className="form-input"
            placeholder={field.label}
          />
        );
    }
  };

  const handleLeaderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeaderData({ ...leaderData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleLeaderFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setLeaderData({ ...leaderData, receipt: base64 });
        setFilePreview({ ...filePreview, leader: base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setSubmitMessage({ type: 'error', text: 'Error uploading ACES receipt. Please try again.' });
      }
    }
  };

  const handleTeamSizeChange = (e) => {
    const selectedSize = parseInt(e.target.value, 10);
    setTeamSize(selectedSize);
    const extraMembersCount = selectedSize - 1;
    const members = Array(extraMembersCount).fill().map(() => ({ ...initialFormData }));
    setTeamMembersData(members);
    setFilePreview({ 
      ...filePreview, 
      members: Array(extraMembersCount).fill(null) 
    });
  };

  const handleTeamMemberChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedMembers = [...teamMembersData];
    updatedMembers[index] = { ...updatedMembers[index], [name]: type === 'checkbox' ? checked : value };
    setTeamMembersData(updatedMembers);
  };

  const handleTeamMemberFileChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        const updatedMembers = [...teamMembersData];
        updatedMembers[index] = { 
          ...updatedMembers[index], 
          receipt: base64 
        };
        setTeamMembersData(updatedMembers);
        
        const updatedPreviews = [...filePreview.members];
        updatedPreviews[index] = base64;
        setFilePreview({
          ...filePreview,
          members: updatedPreviews
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setSubmitMessage({ 
          type: 'error', 
          text: 'Error uploading ACES receipt for team member. Please try again.' 
        });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log(payload);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const payload = {
      teamName,
      teamSize,
      leader: leaderData,
      teamMembers: teamMembersData,
      paymentScreenshot,
      registrationStatus: 'pending'
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      setSubmitMessage({
        type: 'success',
        text: 'Team registration successful! Your registration is pending verification. You will receive a confirmation email shortly.'
      });

      // Reset form
      setTeamName('');
      setLeaderData(initialFormData);
      setTeamMembersData([{ ...initialFormData }]);
      setPaymentScreenshot('');
      setFilePreview({
        leader: null,
        members: Array(3).fill(null),
        paymentScreenshot: null
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'There was an error submitting your registration. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  const showReceipt = (data) => data.isAcesMember;

  return (
    <div className="hackathon-registration-container">
      {/* <Link to="/team-registration" className="registration-button">
        Team Registration
      </Link> */}
      
      <header className="registration-header">
        <h1>Hackathon Team Registration</h1>
        <p>Register your team for the upcoming hackathon event!</p>
      </header>
      
      {submitMessage.text && (
        <div className={`alert alert-${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-section team-size-section">
          <h2>Team Information</h2>
          <div className="form-group">
            <label htmlFor="teamSize">Team Size (including leader):</label>
            <select id="teamSize" value={teamSize} onChange={handleTeamSizeChange} className="form-select">
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="teamName">Team Name:<span className="required">*</span></label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your team name"
            />
          </div>
        </div>
        
        <div className="form-section leader-section">
          <h2>Team Leader Information</h2>
          <div className="form-row">
            {formFields.map(field => (
              (!field.name.includes('receipt') || showReceipt(leaderData)) && (
                <div className="form-group" key={field.name}>
                  <label htmlFor={field.name}>
                    {field.label}{field.required && <span className="required">*</span>}
                  </label>
                  {field.type === 'file' 
                    ? renderFormField(field, '', handleLeaderChange, handleLeaderFileChange, filePreview.leader)
                    : renderFormField(field, leaderData[field.name], handleLeaderChange)
                  }
                </div>
              )
            ))}
          </div>
        </div>
        
        {teamMembersData.map((member, index) => (
          <div key={index} className="form-section member-section">
            <h2>Team Member {index + 2} Information</h2>
            <div className="form-row">
              {formFields.map(field => (
                (!field.name.includes('receipt') || showReceipt(member)) && (
                  <div className="form-group" key={`${field.name}-${index}`}>
                    <label htmlFor={`${field.name}-${index}`}>
                      {field.label}{field.required && <span className="required">*</span>}
                    </label>
                    {field.type === 'file'
                      ? renderFormField(
                          field,
                          '',
                          (e) => handleTeamMemberChange(index, e),
                          (e) => handleTeamMemberFileChange(index, e),
                          filePreview.members[index],
                          index
                        )
                      : renderFormField(
                          field,
                          member[field.name],
                          (e) => handleTeamMemberChange(index, e),
                          null,
                          null,
                          index
                        )
                    }
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
        
        <div className="form-section payment-section">
          <h2>Payment Information</h2>
          <div className="payment-details">
            <div className="qr-code-container">
              <img 
                src="./Images/QR Code.jpg" 
                alt="Payment QR Code" 
                className="payment-qr-code" 
              />
              <p className='payment-info'>Scan QR code to pay registration fee</p>
              <p className='payment-info'>Registration Fee: ₹1000 per team</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentScreenshot">
                Upload Payment Screenshot:<span className="required">*</span>
              </label>
              <div className="file-upload-container">
                <input
                  id="paymentScreenshot"
                  type="file"
                  onChange={handlePaymentScreenshotChange}
                  accept="image/*"
                  required
                  className="file-input"
                />
                {filePreview.paymentScreenshot && (
                  <div className="file-preview">
                    <img 
                      src={filePreview.paymentScreenshot} 
                      alt="Payment Screenshot Preview" 
                      className="preview-image" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register Team'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;