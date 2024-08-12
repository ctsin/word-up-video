import {Composition} from 'remotion';
import {PlaygroundComposition} from './PlaygroundComposition';

type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const POSITION: GridType = 4;

export interface WordProps {
	item: {
		prefix?: string;
		body: string;
		suffix?: string;
	};
	meaning: string[];
	phonetic: {
		prefix?: string;
		body: string;
		suffix?: string;
	};
	mp3: Partial<Record<'EN' | 'US', string>>;
}

export const WORD_LIST: WordProps[] = [
	{
		item: {
			prefix: 'in',
			body: 'tention',
		},
		meaning: ['意图', '目的'],
		phonetic: {
			prefix: 'ɪn',
			body: 'ˈtenʃən',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/intention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/intention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 're',
			body: 'tention',
		},
		meaning: ['保持', '保留'],
		phonetic: {
			prefix: 'rɪ',
			body: 'ˈtenʃən',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/ld41retention.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/retention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 'de',
			body: 'tention',
		},
		meaning: ['拘留', '关押'],
		phonetic: {
			prefix: 'dɪ',
			body: 'ˈtenʃən',
		},
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/detention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/detention.mp3?version=1.2.71',
		},
	},
	{
		item: {
			prefix: 'at',
			body: 'tention',
		},
		meaning: ['注意', '注意力'],
		phonetic: {
			prefix: 'ə',
			body: 'ˈtenʃən',
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

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="playground"
			component={PlaygroundComposition}
			durationInFrames={durationInFrames}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
	);
};
