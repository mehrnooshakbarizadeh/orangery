import EventHistoryPage from "../../src/components/dashboard/event/EventHistory/historyList";
import Scaffold from "../../src/components/dashboard/_components/Scaffold";
import OrganizerReviewPage from "../../src/components/dashboard/event/organizer/organizer-preview/OrganizerReviewPage";
import OrganizerEventsPage from "../../src/components/dashboard/event/organizer/OrganizerEventsPage";

function organizerEvents() {
  return (
    <>
      <Scaffold>
        <OrganizerEventsPage />
      </Scaffold>
    </>
  );
}

export default organizerEvents;
