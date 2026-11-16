import AutomationsList from "../../../../src/components/dashboard/apps/automations/AutomationsList";
import Scaffold from "../../../../src/components/dashboard/_components/Scaffold";
import AutomationForm from "../../../../src/components/dashboard/apps/automations/AutomationForm";

function AutomationsListPage() {
  let queryString = '';
  if (typeof window !== "undefined") {
    queryString = window && window.location.search;
  }
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')
  const index = parseInt(urlParams.get('index') ?? '0');
  return (
    <>
      <Scaffold>
        {id
          ? <AutomationForm automationUuid={id} index={index} />
          : <AutomationsList />
        }
      </Scaffold>
    </>
  );
}

export default AutomationsListPage;
