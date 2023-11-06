import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function DateLocalizationProvider ({children}) {
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
    {children}
  </LocalizationProvider>;
}

export {DateLocalizationProvider}
export default DateLocalizationProvider