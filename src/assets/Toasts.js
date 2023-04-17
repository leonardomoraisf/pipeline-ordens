import Swal from 'sweetalert2/dist/sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.Toast = Toast;

const ToastTopEnd5 = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastTopEnd5 = ToastTopEnd5;

const ToastTopStart5 = Swal.mixin({
  toast: true,
  position: "top-start",
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastTopStart5 = ToastTopStart5;

const ToastCenter = Swal.mixin({
  position: "center",
  timer: 10000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastCenter = ToastCenter;

const ToastCenter5 = Swal.mixin({
  position: "center",
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false
});
window.ToastCenter5 = ToastCenter5;