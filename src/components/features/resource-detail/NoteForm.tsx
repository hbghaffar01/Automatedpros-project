import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { notesStorage } from '@/utils/storage';

const noteSchema = z.object({
  note: z.string().max(1000, 'Note must be less than 1000 characters'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  pokemonId: number;
  pokemonName: string;
}

export function NoteForm({ pokemonId, pokemonName }: NoteFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [savedNote, setSavedNote] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: '',
    },
  });

  const noteValue = watch('note');
  const characterCount = noteValue?.length || 0;

  useEffect(() => {
    const existingNote = notesStorage.get(pokemonId);
    if (existingNote) {
      setSavedNote(existingNote.note);
      reset({ note: existingNote.note });
    }
  }, [pokemonId, reset]);

  const onSubmit = (data: NoteFormData) => {
    notesStorage.set(pokemonId, data.note);
    setSavedNote(data.note);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      notesStorage.remove(pokemonId);
      setSavedNote('');
      reset({ note: '' });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    reset({ note: savedNote });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Personal Notes
      </h3>

      {!isEditing && savedNote ? (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {savedNote}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Add a note about {pokemonName}
            </label>
            <textarea
              id="note"
              {...register('note')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-none"
              placeholder="Write your thoughts, strategies, or memories about this Pokémon..."
            />
            {errors.note && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.note.message}
              </p>
            )}
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
              {characterCount}/1000
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!isDirty || characterCount === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
            {(isEditing || savedNote) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
