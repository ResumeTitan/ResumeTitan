import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import Spinner from '../../components/Spinner';
import { createResume } from '../../api/resume.js';
import SuccessAlert from '../../components/Alert/SuccessAlert';

import './index.css';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const isAuth = Boolean(useSelector((state) => state.token));

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [waitingForResume, setWaitingForResume] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(location.state?.newUser || false);

  const formatPhoneNumber = () => {
    // Remove all non-digit characters from the input
    const digitsOnly = phone.replace(/\D/g, '');

    // Format the phone number
    let formattedNumber = '';
    if (digitsOnly.length >= 3) {
      formattedNumber += `(${digitsOnly.slice(0, 3)})`;
    }
    if (digitsOnly.length >= 6) {
      formattedNumber += ` ${digitsOnly.slice(3, 6)}`;
    }
    if (digitsOnly.length > 6) {
      formattedNumber += `-${digitsOnly.slice(6)}`;
    }

    return formattedNumber;
  };

  /*
    @return Promise<void>
   */
  async function handleSubmit() {
    try {
      setWaitingForResume(true);
      const payload = {
        firstName,
        lastName,
        phone,
        schools,
        jobs,
        email,
        password: user.password,
        userId: user._id,
      }

      if (isAuth) {
        const response = await createResume(token, payload);
        navigate(`/resume`, { state: { resume: response.resume } });
        setWaitingForResume(false);
      } else {
        alert('Please log in before submitting a resume');
      }
    } catch (error) {
      alert('Something went wrong, please try again');
      console.error(error);
      setWaitingForResume(false);
    }
  }

  const addSchool = () => {
    const newSchool = {
      name: '',
      location: '',
      degree: '',
      notes: '',
      gpa: 0,
      major: '',
      graduationDate: '',
      accomplishments: [],
    }
    setSchools([...schools, newSchool]);
  }

  const deleteSchool = (index) => {
    let data = [...schools];
    data.splice(index, 1);
    setSchools(data);
  }

  const handleSchoolsChange = (index, event) => {
    const data = [...schools];
    const keyName = event.target.id.substr('school'.length).match(/[a-zA-Z]+/g)?.at(0) || '';

    switch(keyName) {
      case 'name':
        data[index].name = event.target.value;
        break;
      case 'location':
          data[index].location = event.target.value;
          break;
      case 'degree':
        data[index].degree = event.target.value;
        break;
      case 'gpa':
        data[index].gpa = parseFloat(event.target.value);
        break;
      case 'major':
        data[index].major = event.target.value;
        break;
      case 'graduationDate':
        data[index].graduationDate = event.target.value;
        break;
      case 'notes':
        data[index].notes = event.target.value;
        break;
      default:
        console.log(`Error: Invalid keyName: ${keyName}`);
        break;
    }

    setSchools(data);
  }

  const addJob = () => {
    let newJob = {
      title: '',
      company: '',
      location: '',
      notes: '',
      responsibilities: [],
    };
    setJobs([...jobs, newJob]);
  }

  const deleteJob = (event, index) => {
    let data = [...jobs];
    data.splice(index, 1);
    setJobs(data);
  }

  const handleJobsChange = (index, event) => {
    let data = [...jobs];
    const keyName = event.target.id.substr('job'.length).match(/[a-zA-Z]+/g)?.at(0) || '';

    switch(keyName) {
      case 'title':
        data[index].title = event.target.value;
        break;
      case 'company':
        data[index].company = event.target.value;
        break;
      case 'location':
        data[index].location = event.target.value;
        break;
      case 'startDate':
        data[index].startDate = event.target.value;
        break;
      case 'endDate':
        data[index].endDate = event.target.value;
        break;
      case 'notes':
        data[index].notes = event.target.value;
        break;
      default:
        console.log(`Error: Invalid keyName: ${keyName}`);
        break;
    }

    setJobs(data);
  }

  if (waitingForResume) {
    return (
      <Spinner />
    );
  } else {
    return (
      <div key="home" className="flex flex-col items-center min-h-screen bg-slate-400">
        { showSuccessMsg && (<SuccessAlert message={`Success! Registered new user, ${user.firstName} ${user.lastName}`} onClose={() => {setShowSuccessMsg(false)}} />)}

        <form onSubmit={handleSubmit} action="/">

        {/* Contact Box */}
        <div className="border-2 bg-background-dark rounded-md border-gray-500 p-5 w-96 max-w-md mx-auto md:max-w-2xl my-6">
          <label className="formLabel">Name</label>
          <input
            id="firstName"
            className="formStyle"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <input
            id="lastName"
            className="formStyle"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
          <label className="formLabel">Email</label>
          <input
            id="email"
            className="formStyle"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label className="formLabel">Phone</label>
          <input
            id="phone"
            className="formStyle"
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>

        {/* School Box */}
        <div className="border-2 bg-background-dark rounded-md border-gray-500 p-5 w-96 mb-6">
          <div className="whitespace-nowrap flex justify-between">
            <div className="formHeader">School Info</div>
            <button type="button" className="addButton bg-slate-800" onClick={addSchool}>Add School</button>
          </div>
          {schools.map((school, index) => (
            <div key={index} className="mt-6">
              <div className="mb-6">
                <label htmlFor={`schoolname${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
                <input 
                  type="text" 
                  id={`schoolname${index}`}
                  className="formStyle" 
                  placeholder="Harvard University" 
                  value={school.name}
                  onChange={(event) => handleSchoolsChange(index, event)}
                  required />
              </div>
              <div className="mb-6">
                <label htmlFor={`schoollocation${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                <input 
                  type="text"
                  id={`schoollocation${index}`}
                  className="formStyle"
                  placeholder="Raleigh, NC"
                  value={school.location}
                  onChange={(event) => handleSchoolsChange(index, event)}
                  required />
              </div> 
              <div className="mb-6">
                <label htmlFor={`schoolmajor${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
                <input 
                  type="text"
                  id={`schoolmajor${index}`}
                  className="formStyle"
                  placeholder="Business Administration"
                  value={school.major}
                  onChange={(event) => handleSchoolsChange(index, event)}
                  required />
              </div> 
              <div className="mb-6">
                <label htmlFor={`schooldegree${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
                <select id={`schooldegree${index}`} className="formStyle" onChange={(event) => handleSchoolsChange(index, event)}>
                  <option >High School Diploma</option>
                  <option>Bachelor of Science</option>
                  <option>Bachelor of Arts</option>
                  <option>Masters Degree</option>
                  <option>Doctorate</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">Graduation Date</label>
                <input
                  type="date" 
                  id={`schoolgraduationDate${index}`}
                  className="formStyle"
                  value={school.graduationDate}
                  onChange={(event) => handleSchoolsChange(index, event)}
                  required />
              </div>
              <div className="my-6">
                <label htmlFor={`schoolnotes${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                <textarea 
                  id={`schoolnotes${index}`}
                  className="formStyle"
                  placeholder="Math club, passed organic chemistry, etc."
                  value={school.notes}
                  onChange={(event) => handleSchoolsChange(index, event)}
                  required />
              </div>
              <button type="button" id={`${index}`} className="removeButton bg-slate-800" onClick={() => deleteSchool(index)}>Remove School</button>
            </div>
          ))}
        </div>

        {/* Job Box */}
        <div className="whitespace-nowrap bg-background-dark border-2 rounded-md border-gray-500 p-4 w-96">
          <div className="flex justify-between">
            <div className="formHeader">Job Info</div>
            <button type="button" className="addButton bg-slate-800" onClick={addJob}>Add Job</button>
          </div>
          {jobs.map((job, index) => job && (
          <>
            <div className="my-6">
              <label htmlFor={`jobtitle${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
              <input 
                type="text"
                id={`jobtitle${index}`}
                className="formStyle"
                placeholder="System Administrator"
                value={job.title}
                onChange={(event) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
              <input 
                type="text" 
                id={`jobcompany${index}`}
                className="formStyle"
                placeholder="JP Morgan Chase"
                value={job.company}
                onChange={(event) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
              <input 
                type="text" 
                id={`joblocation${index}`}
                className="formStyle" 
                placeholder="Raleigh, NC"
                value={job.location}
                onChange={(event) => handleJobsChange(index, event)}
                required />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">Start Date</label>
                <input
                  type="date" 
                  id={`jobstartDate${index}`}
                  className="formStyle"
                  value={job.startDate}
                  onChange={(event) => handleJobsChange(index, event)}
                  required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">End Date</label>
                <input 
                  type="date" 
                  id={`jobendDate${index}`}
                  className="formStyle" 
                  value={job.endDate}
                  onChange={(event) => handleJobsChange(index, event)}
                  required />
              </div>
            </div>
            <div className="my-6">
              <label htmlFor={`jobnotes${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
              <textarea 
                id={`jobnotes${index}`}
                className="formStyle"
                placeholder="Leader on team, project development, etc."
                value={job?.notes}
                onChange={(event) => handleJobsChange(index, event)}
                required />
            </div>
            <button type="button" className="removeButton bg-slate-800" onClick={(e) => deleteJob(e, index)}>Remove Job</button>
          </>
        ))}
        </div>

        {/* Generate button */}
        <div className="flex justify-center items-center">
          <button type="submit" className="submitButton bg-slate-800">
            Generate Resume
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default HomePage;
