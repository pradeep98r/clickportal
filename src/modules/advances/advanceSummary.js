import { useSelector } from "react-redux";

const AdvanceSummary = () =>{
const advancesData = useSelector((state) => state.advanceInfo);
const advancesSummary = advancesData?.advanceSummaryById;
const selectedParty = advancesData?.selectedPartyByAdvanceId
console.log(advancesSummary,'Summary');
return (
   <div>
       {selectedParty.partyId}
   </div> 
)
}
export default AdvanceSummary;