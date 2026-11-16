import { Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function HandleStatus({
  status,
  modifiedBy,
}: {
  status: string;
  modifiedBy: string;
}) {
  const router = useRouter();
  const isAdmin = router.pathname.includes("event-hisotry");
  console.log(isAdmin);

  return (
    <>
      {status === "requested" && (
        <>
          <ModifiedByTag modifiedBy={modifiedBy} isAdmin={isAdmin} />
          <RequestedTag />
        </>
      )}
      {status === "accepted" && (
        <>
          <AdminTag isAdmin={isAdmin} />
          <AcceptedTag />
        </>
      )}
      {status === "declined" && (
        <>
          <AdminTag isAdmin={isAdmin} />
          <DeclinedTag />
        </>
      )}
      {status === "modified" && <ModifiedTag />}
    </>
  );
}

const AdminTag = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "6px",
          py: "1px",
        }}
      >
        {isAdmin ? "You/Admin" : "Admin"}
      </Typography>
    </>
  );
};

const LatestTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "6px",
          py: "1px",
        }}
      >
        Latest
      </Typography>
    </>
  );
};
const AcceptedTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#42B863",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "14px",
          py: "2px",
        }}
      >
        Accept
      </Typography>
    </>
  );
};
const ModifiedByTag = ({
  modifiedBy,
  isAdmin,
}: {
  modifiedBy: string;
  isAdmin: boolean;
}) => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#A5AAB4",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "14px",
          py: "2px",
          whiteSpace: "nowrap",
        }}
      >
        {!isAdmin ? `You / ${modifiedBy}` : modifiedBy}
      </Typography>
    </>
  );
};
const RequestedTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#FF9900",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "14px",
          py: "2px",
        }}
      >
        Request
      </Typography>
    </>
  );
};

const DeclinedTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#FF3D00",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "14px",
          py: "2px",
        }}
      >
        Declined
      </Typography>
    </>
  );
};

const ModifiedTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#09ACD0",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "14px",
          py: "2px",
        }}
      >
        Changed
      </Typography>
    </>
  );
};
