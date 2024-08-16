import {Composition, Still} from 'remotion';
import {PlaygroundComposition} from './PlaygroundComposition';
import {CoverComposition} from './CoverComposition';
import {z} from 'zod';

type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const POSITION: GridType = 4;

export interface WordProps {
	item: {
		prefix?: string;
		body?: string;
		suffix?: string;
	};
	meaning: string[];
	phonetic: {
		prefix?: string;
		body?: string;
		suffix?: string;
	};
	mp3: Partial<Record<'EN' | 'US', string>>;
}

export const isPrefix = false;
export const isSuffix = true;
export const BODY = 'tention';
export const BODY_PHONETIC = 'ˈtenʃən';

export const WORD_LIST: WordProps[] = [
	{
		item: {
			prefix: 'in',
		},
		meaning: ['意图', '目的'],
		phonetic: {
			prefix: 'ɪn',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/intention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/intention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 're',
		},
		meaning: ['保持', '保留'],
		phonetic: {
			prefix: 'rɪ',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/ld41retention.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/retention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 'de',
		},
		meaning: ['拘留', '关押'],
		phonetic: {
			prefix: 'dɪ',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/detention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/detention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 'at',
		},
		meaning: ['注意', '注意力'],
		phonetic: {
			prefix: 'ə',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/attention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/attention1.mp3?version=1.2.71',
		},
	},
];

export const FACTOR = 5;
export const FPS = FACTOR * 6;
export const GRID: GridType = 12;
export const itemDurationInFrames = FPS * 6;
export const EntranceDurationInFrames = FPS * 0.5;
export const durationInFrames =
	EntranceDurationInFrames + itemDurationInFrames * WORD_LIST.length;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const COLOR = '#252627';
export const HIGHLIGHT = '#F43939';
export const FlexCenter: React.CSSProperties = {
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
					body: BODY,
				}}
			/>
			<Composition
				id="playground"
				component={PlaygroundComposition}
				durationInFrames={durationInFrames}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
