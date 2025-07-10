import Swal from "sweetalert2";

interface NotificationOptions {
    title: string;
    text: string;
    icon: "success" | "error";
}

export const showNotification = ({ title, text, icon }: NotificationOptions) => {
    Swal.fire({
        title,
        text,
        icon,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: true
    });
};
