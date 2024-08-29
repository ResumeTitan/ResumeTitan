import React, { useEffect, useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {  Form, FormInput, FormButton, FormAlert, FormLabel, FormDateInput, FormHeader } from "components/Form/styled";
import "styles/index.css";

export interface AwardType {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface AwardsProps {
  initAwards: AwardType[];
  aiLoading: boolean;
  onUpdate: (awards: AwardType[]) => void;
  onAiCall: () => void;
}

/**
 * @function Awards
 * @description Awards component for managing a list of awards.
 * @param {AwardsProps} props - The props for the Awards component.
 * @returns {React.ReactElement} The rendered Awards component.
 */
const Awards: React.FC<AwardsProps> = ({ initAwards, aiLoading, onUpdate, onAiCall }) => {
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * @function handleAwardsChange
   * @description Handles changes to an award input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the award being changed.
   * @param {'title' | 'date' | 'awarder' | 'summary'} field - The field being changed.
   */
  const handleAwardsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: "title" | "date" | "awarder" | "summary"
  ) => {
    const { value } = e.target;
    const newAwards = [...awards];
    newAwards[index][field] = value;
    setAwards(newAwards);
  };

  /**
   * @function handleAddAward
   * @description Adds a new empty award to the list.
   */
  const handleAddAward = () => {
    setAwards([...awards, { title: "", date: "", awarder: "", summary: "" }]);
  };

  /**
   * @function handleAwardDelete
   * @description Deletes an award from the list.
   * @param {number} index - The index of the award to delete.
   */
  const handleAwardDelete = (index: number) => {
    const newAwards = [...awards];
    newAwards.splice(index, 1);
    setAwards(newAwards);
  };

  /**
   * @function handleSaveAwards
   * @description Saves the current awards and exits editing mode.
   */
  const handleSaveAwards = () => {
    setIsEditing(false);
    onUpdate(awards);
  };

  // Initialize awards with initAwards prop
  useEffect(() => {
    setAwards(initAwards);
  }, [initAwards]);

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <FormHeader onClick={() => {setIsEditing(!isEditing)}}>{"Awards"}</FormHeader>

      {isEditing ? (
        <Form >
            <FormLabel>Title:</FormLabel>
            <FormInput type="text" value={"title"} onChange={e => console.log(e)}/>
            <FormLabel>Awarder:</FormLabel>
            <FormInput type="text" value={"text"} onChange={(e) => console.log(e)} />
            <FormButton type="submit" disabled={true}>Login</FormButton>
            <FormDateInput type="text" onChange={e => console.log(e)}/>
        </Form>



        // <div className="p-4">
        //   <div className="flex justify-between mb-4">
        //     <button className="green-button p-4 text-xl" onClick={handleSaveAwards}>
        //       {"Save"}
        //     </button>
        //     <div className="flex justify-center">
        //       <button className="green-button p-4" onClick={handleAddAward}>
        //         {"Add Award"}
        //       </button>
        //       <button className="green-button p-4" onClick={onAiCall}>
        //         <div>
        //           <AutoAwesomeIcon className="pr-2" />
        //           <span>Write with AI</span>
        //         </div>
        //       </button>
        //     </div>
        //   </div>
        //   <div className="flex flex-col justify-between">
        //     {awards.map((award, awardIndex) => (
        //       <div key={awardIndex} className="mb-2 p-4 border rounded">
        //         <div className="flex flex-row">
        //           <input
        //             type="text"
        //             className="form-style mb-1"
        //             placeholder="Award Title"
        //             value={award.title}
        //             onChange={(e) => handleAwardsChange(e, awardIndex, "title")}
        //             required
        //           />
        //         </div>
        //         <div className="flex flex-row mb-2">
        //           <input
        //             type="text"
        //             className="form-style mr-2"
        //             placeholder="Awarder"
        //             value={award.awarder}
        //             onChange={(e) => handleAwardsChange(e, awardIndex, "awarder")}
        //             required
        //           />
        //           <input
        //             type="date"
        //             className="form-style"
        //             placeholder="Date"
        //             value={award.date}
        //             onChange={(e) => handleAwardsChange(e, awardIndex, "date")}
        //             required
        //           />
        //         </div>
        //         <textarea
        //           className="form-style mb-2"
        //           placeholder="Summary"
        //           value={award.summary}
        //           onChange={(e) => handleAwardsChange(e, awardIndex, "summary")}
        //         />
        //         <button
        //           className="remove-content-button whitespace-nowrap my-2"
        //           onClick={() => handleAwardDelete(awardIndex)}
        //         >
        //           Delete Award
        //         </button>
        //       </div>
        //     ))}
        //   </div>
        // </div>
      ) : (
        <>
          {awards && (
            <div
              className="form-secondary-area"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              {awards.map((award) => award.title).join(", ")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Awards;
