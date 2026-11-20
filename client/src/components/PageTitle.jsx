import { useEffect } from 'react';
import { STUDENT_ID, STUDENT_NAME } from '../utils/constants';

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = `${title} | ${STUDENT_NAME} (${STUDENT_ID})`;
  }, [title]);
  return null;
}
