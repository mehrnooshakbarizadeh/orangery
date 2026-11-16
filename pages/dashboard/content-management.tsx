import ContentManagementTabs from "../../src/components/dashboard/content-management/ContentManagementNav";
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

function ContentManagement() {
  return (
    <>
      <Scaffold>
        <ContentManagementTabs />
      </Scaffold>
    </>
  );
}

export default ContentManagement;
