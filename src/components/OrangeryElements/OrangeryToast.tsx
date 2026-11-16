// external dependencies
import Swal, { SweetAlertIcon } from "sweetalert2";

export default function OrangeryToast(
  message: string | HTMLElement | JQuery,
  status: SweetAlertIcon,
  subtitle?: string
) {
  const toast_ = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  toast_.fire({
    icon: status,
    title: message,
    html: subtitle ? `<div style="font-size: 14px;color:'#55585C'; font-weight: 400; margin-top: 2px;">${subtitle ?? ""}</div>` : ``
  });
}
