import EventHistoryPage from "../../src/components/dashboard/event/EventHistory/historyList";
import Scaffold from "../../src/components/dashboard/_components/Scaffold";
import OrganizerReviewPage from "../../src/components/dashboard/event/organizer/organizer-preview/OrganizerReviewPage";

function OrganizerPreview() {
  return (
    <>
      <Scaffold>
        <OrganizerReviewPage />
      </Scaffold>
    </>
  );
}

export default OrganizerPreview;
