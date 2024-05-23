import * as Yup from 'yup';

export const noteSchema = Yup.object().shape({
  description: Yup.string().required('notes.description_required'),
  favorite: Yup.boolean().optional(),
});
