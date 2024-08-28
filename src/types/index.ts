import {z} from 'zod';

export type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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
	position: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
		z.literal(6),
		z.literal(7),
		z.literal(8),
		z.literal(9),
		z.literal(10),
		z.literal(11),
		z.literal(12),
	]),
});

export type ItemsCompositionProps = z.infer<typeof ItemsSchema>;
