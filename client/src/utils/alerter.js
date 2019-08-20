import { toast } from 'react-toastify';

const alerter = {
	alert: toast.error,
	warn: toast.warn,
	info: toast.info,
	success: toast.success,
}

export default alerter;