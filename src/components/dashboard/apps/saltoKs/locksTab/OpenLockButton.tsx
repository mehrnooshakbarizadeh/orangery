// react & next
//

// external dependencies
import { LoadingButton } from '@mui/lab';

// orangery elements & internal dependencies
import {
  OrangeryToast
} from "../../../../OrangeryElements";


// queries & backend
import {
  ILock,
  useOpenLock
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
//

export default function OpenLockButton({
  lock,
  disabled
}: {
  lock: ILock;
  disabled?: boolean;
}) {
  const mutation = useOpenLock();

  async function handleOpenLock(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ lock_id: lock.lock_id });
      OrangeryToast(`Successfully opened.`, "success");
    } catch (err: any) {
      OrangeryToast(`Some error!`, "error");
    }
  }

  return (
    <>
      <LoadingButton
        color="primary"
        onClick={handleOpenLock}
        sx={{
          // width: 134,
          height: 35,
          fontSize: 20,
          color: "#074EE8",
          backgroundColor: "transparent",
          // mr: 2,
          flex: "none"
        }}
        loading={mutation.isLoading}
        loadingPosition="start"
        disabled={mutation.isLoading || disabled}
      >
        {!mutation.isLoading
          ? "Open remotely"
          : "Opening..."
        }
      </LoadingButton>
    </>
  );
}
