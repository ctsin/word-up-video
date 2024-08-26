import {z} from 'zod';

export const CoverSchema = z.object({
	body: z.string(),
});

export const WordSchema = z.object({
	item: z.string(),
	meaning: z.string().array(),
	phonetic: z.string(),
	mp3: z.object({
		US: z.string(),
		EN: z.string(),
	}),
});
export const ItemsSchema = z.object({
	affix: z.string(),
	affixPhonetic: z.string(),
	wordList: WordSchema.array(),
});

export type WordListType = z.infer<typeof ItemsSchema.shape.wordList>;
export type ItemsCompositionProps = z.infer<typeof ItemsSchema>;
