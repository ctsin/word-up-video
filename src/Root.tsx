import {CalculateMetadataFunction, Composition, Still} from 'remotion';
import {ItemsComposition} from './ItemsComposition';
import {CoverComposition} from './CoverComposition';
import {z} from 'zod';
import {EndScene} from './EndSceneComposition';

type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const POSITION: GridType = 4;

export const WordSchema = z.object({
	item: z.string(),
	meaning: z.string().array(),
	phonetic: z.string(),
	mp3: z.object({
		US: z.string(),
		EN: z.string(),
	}),
});
export const WordListSchema = WordSchema.array();
export const ItemsSchema = z.object({
	affix: z.string(),
	affixPhonetic: z.string(),
	wordList: WordListSchema,
});
export type ItemsCompositionProps = z.infer<typeof ItemsSchema>;

export const AFFIX = 'tention';
export const AFFIX_PHONETIC = 'ˈtenʃən';

export const FACTOR = 5;
export const FPS = FACTOR * 6;
export const GRID: GridType = 12;
export const ItemDurationInFrames = FPS * 6;
export const EntranceDurationInFrames = FPS * 0.5;
export const ExitDurationInFrames = EntranceDurationInFrames;

export const getItemsDurationInFrames = (listLength: number) =>
	ItemDurationInFrames * listLength;

export const getDurationInFrames = (listLength: number) =>
	EntranceDurationInFrames +
	getItemsDurationInFrames(listLength) +
	ExitDurationInFrames;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const COLOR = '#252627';
export const HIGHLIGHT = '#F43939';
export const BACKGROUND_COLOR = '#D9DFE2';
export const flexCenter: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

export const useLeft = () => (WIDTH / GRID) * POSITION;

export const secondaryBaseStyle = {
	color: COLOR,
	opacity: 0.2,
};

export const PhoneticSign = () => (
	<span
		style={{
			...secondaryBaseStyle,
			display: 'inline-block',
			margin: '0 0.3em',
		}}
	>
		/
	</span>
);

export const CoverSchema = z.object({
	body: z.string(),
});

const calculateMetadata: CalculateMetadataFunction<ItemsCompositionProps> = ({
	defaultProps: {wordList},
}) => {
	return {durationInFrames: getDurationInFrames(wordList.length)};
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Still
				id="cover"
				component={CoverComposition}
				width={WIDTH}
				height={HEIGHT}
				schema={CoverSchema}
				defaultProps={{
					body: AFFIX,
				}}
			/>
			<Composition
				id="items"
				component={ItemsComposition}
				calculateMetadata={calculateMetadata}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={ItemsSchema}
				defaultProps={{
					affix: AFFIX,
					affixPhonetic: AFFIX_PHONETIC,
					wordList: [
						{
							item: 'intention',
							meaning: ['意图', '目的'],
							phonetic: 'ɪnˈtenʃən',
							mp3: {
								EN: 'https://www.ldoceonline.com/media/english/breProns/intention0205.mp3?version=1.2.71',
								US: 'https://www.ldoceonline.com/media/english/ameProns/intention.mp3?version=1.2.71',
							},
						},
						{
							item: 'retention',
							meaning: ['保持', '保留'],
							phonetic: 'rɪˈtenʃən',
							mp3: {
								EN: 'https://www.ldoceonline.com/media/english/breProns/ld41retention.mp3?version=1.2.71',
								US: 'https://www.ldoceonline.com/media/english/ameProns/retention.mp3?version=1.2.71',
							},
						},
						{
							item: 'detention',
							meaning: ['拘留', '关押'],
							phonetic: 'dɪˈtenʃən',
							mp3: {
								EN: 'https://www.ldoceonline.com/media/english/breProns/detention0205.mp3?version=1.2.71',
								US: 'https://www.ldoceonline.com/media/english/ameProns/detention.mp3?version=1.2.71',
							},
						},
						{
							item: 'attention',
							meaning: ['注意', '注意力'],
							phonetic: 'əˈtenʃən',
							mp3: {
								EN: 'https://www.ldoceonline.com/media/english/breProns/attention0205.mp3?version=1.2.71',
								US: 'https://www.ldoceonline.com/media/english/ameProns/attention1.mp3?version=1.2.71',
							},
						},
					],
				}}
			/>
			<Composition
				id="endScene"
				component={EndScene}
				fps={FPS}
				durationInFrames={90}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
