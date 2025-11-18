import type { SweetAlertOptions } from 'sweetalert2';

export const SWEET_ALERT_PARAMS = {
    buttonsStyling: false,
    message: {
        title: 'En êtes vous sûr ?',
        html: `htmlMessage.`,
        icon: 'warning' as const,
        showCancelButton: true,
        confirmButtonColor: '#569C5B',
        cancelButtonColor: '#dc3545',
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Oui',
    } as SweetAlertOptions,

    showCancelButton: true,

    customClass: {
        container: 'modern-swal-container',
        popup: 'modern-swal-popup',
        header: 'modern-swal-header',
        title: 'modern-swal-title',
        htmlContainer: 'modern-swal-content',
        actions: 'modern-swal-actions',
        confirmButton: 'modern-swal-confirm-btn',
        cancelButton: 'modern-swal-cancel-btn',
        icon: 'modern-swal-icon-container',
    },

    showClass: {
        popup: 'swal2-show-modern',
        backdrop: 'swal2-backdrop-show-modern',
    },
    hideClass: {
        popup: 'swal2-hide-modern',
        backdrop: 'swal2-backdrop-hide-modern',
    },
    focusConfirm: false,
    allowEscapeKey: true,
    allowOutsideClick: false,
};
