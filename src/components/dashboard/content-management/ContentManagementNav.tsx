import React from "react";
import OrangeryRoutedTabs from "../../OrangeryElements/OrangeryRoutedTabs";
import PublishedTab from "./published/PublishedTab";
import ReportedContentTab from "./reportedTab/ReportedContentTab";
import ReportedUserTab from "./reportedUserTab/ReportedUserTab";

export default function ContentManagementTabs() {
  const tabs = [
    {
      slug: "published",
      label: "Published",
      content: <PublishedTab />,
    },
    {
      slug: "reported_content",
      label: "Reported Content",
      content: <ReportedContentTab />,
    },
    {
      slug: "reported_users",
      label: "Reported Users",
      content: <ReportedUserTab />,
    },
  ];

  return <OrangeryRoutedTabs tabs={tabs} />;
}
