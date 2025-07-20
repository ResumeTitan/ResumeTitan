import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Spinner from 'components/Spinner';
import api from 'api/actions';
import { FormContainer } from 'components/Form/styled';
import FormField from 'components/Form/FormField';
import FormArea from 'components/Form/FormArea';
import FormDropdown from 'components/Form/FormDropdown';
import 'styles/index.css';
import { ResumeType } from 'types/types';
import { FlexContainer } from 'components/Form/styled';

const JobHelper: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [userResumes, setUserResumes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * @function loadCoverLetter
   */
  const loadCoverLetter = async (id: string) => {
    const response = await api.get(`/cover-letter/${id}`);
    if (response.status !== 404) {
      return response.data.coverLetter;
    }
  }

  /**
   * @function loadResumes
   */
  const loadResumes = async (id: string) => {
    const response = await api.get(`/resume/user?userId=${id}`);
    const resumesIn = response.data.resumes;

    if (resumesIn.length >= 0) {
      setUserResumes(resumesIn);
      return resumesIn[0]._id;
    } else {
      return 0;
    }
  }

  // /**
  //  * @function useEffect
  //  * @description Called when page loads
  //  */
  // React.useEffect(() => {
  //   if (!isSignedIn) {
  //     navigate("/sign-in");
  //   }

  //   async function load() {
  //     let newCoverLetter = coverLetter;
  //     if (location.state) {
  //       const id = location.state.id;
  //       newCoverLetter = await loadCoverLetter(id);
  //       newCoverLetter["_id"] = id;
  //     }

  //     if (user) {
  //       if (newCoverLetter.name === '') {
  //         newCoverLetter["name"] = user.fullName || 'Your Name';
  //       }
  //       const resumeId = await loadResumes(user.id);
  //       newCoverLetter["resumeId"] = resumeId;
  //     }

  //     setCoverLetter(newCoverLetter);
  //   }

  //   load();
  // }, [user]);

  // /**
  //  * @function handleGenerateCoverLetter
  //  * @description Call AI to generate cover letter
  //  */
  // const handleGenerateCoverLetter = async () => {
  //   try {
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     setIsLoading(true);
  //     const response = await api.post("cover-letter", { 
  //       coverLetter,
  //       clerkId: user.id 
  //     });

  //     setCoverLetter(response.data.coverLetter);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const handleSaveCoverLetter = async () => {
  //   try {
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     setIsLoading(true);
  //     const response = await api.put(`cover-letter/${coverLetter._id}`, { 
  //       coverLetter,
  //       clerkId: user.id 
  //     });

  //     setCoverLetter(response.data.coverLetter);
  //     setIsLoading(false);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  if (!user) {
    return null;
  }

  return (
    <FlexContainer>
      <div className="left-section no-print">
        <div className="form-container">
          <div className="form-text-main">
            Cover Letter Information
          </div>
          <div>
            <FormField 
              title={"Name"}
            />
            <FormField 
              title={"Job Title"}
            />
            <FormArea 
              title={"Job Description"}
            />
            <FormContainer>
              <FormField 
                title={"City"}
              />
              <FormField 
                title={"State"}
              />
            </FormContainer>
            <FormField 
                title={"Company Name"}
              />
            <FormDropdown 
              title={"Select Resume"}
              onChange={(event) => {
                const resumeId = userResumes.find((res: ResumeType) => res.name === event.target.value);
                if (resumeId) {
                  // setCoverLetter({...coverLetter, resumeId});
                }
              }}
            >
              {userResumes && userResumes.map((resume: any) => (
                <option value={resume.id}>{resume.name}</option>
              ))}
            </FormDropdown>
          </div>
          <div className="p-4">
            {/* <button
              className="interview-button"
              onClick={handleGenerateCoverLetter}
            >
              {"Generate Cover Letter"}
            </button> */}
            <button
              className="interview-button"
              onClick={() => window.print()}
            >
              {"Print Cover Letter"}
            </button>
            {/* {coverLetter.letter && (
              <button
                className="interview-button"
                onClick={handleSaveCoverLetter}
              >
                {"Save Cover Letter"}
              </button>
            )} */}
          </div>
        </div>
      </div>

      { isLoading && (
        <Spinner />
      )}

    </FlexContainer>
  );
};

export default JobHelper;
