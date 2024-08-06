import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {FPS} from './Root';

const Background = () => {
	const frame = useCurrentFrame();
	const backgroundColor = interpolateColors(
		frame,
		[0, FPS / 3],
		['#D9DFE2', '#F35353']
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor,
			}}
		/>
	);
};

interface SingleWordProps {
	word: WordProps;
	index: number;
}

const SingleWord = ({
	word: {highlight, prefix, suffix, meaning, phonetic},
	index,
}: SingleWordProps) => {
	const lineHeight = 200;
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numberEnter = spring({frame, fps, config: {damping: 200}});
	const y = interpolate(numberEnter, [0, 1], [lineHeight, 0]);
	const opacity = interpolate(numberEnter, [0, 1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `translateY(${y}px)`,
				fontSize: lineHeight,
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				color: 'white',
				top: index * lineHeight,
				opacity,
			}}
		>
			{prefix}
			{highlight}
			{suffix}
			<div>{phonetic}</div>
			{meaning.map((m) => (
				<div key={m}>{m}</div>
			))}
		</AbsoluteFill>
	);
};

type WordProps = {
	item: string;
	prefix: string;
	suffix: string;
	highlight: string;
	meaning: string[];
	phonetic: string;
	mp3: Record<'EN' | 'US', string>;
};

const WORD_LIST: WordProps[] = [
	{
		item: 'retention',
		highlight: 'tention',
		prefix: 're',
		suffix: '',
		meaning: ['保持', '保留'],
		phonetic: 'rɪˈtenʃən',
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/ld41retention.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/retention.mp3?version=1.2.71',
		},
	},
	{
		item: 'detention',
		highlight: 'tention',
		prefix: 'de',
		suffix: '',
		meaning: ['拘留', '关押'],
		phonetic: 'dɪˈtenʃən',
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/detention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/detention.mp3?version=1.2.71',
		},
	},
	{
		item: 'attention',
		highlight: 'tention',
		prefix: 'at',
		suffix: '',
		meaning: ['注意', '注意力'],
		phonetic: 'əˈtenʃən',
		mp3: {
			EN: 'https://www.ldoceonline.com/media/english/breProns/attention0205.mp3?version=1.2.71',
			US: 'https://www.ldoceonline.com/media/english/ameProns/attention1.mp3?version=1.2.71',
		},
	},
];

export const PlaygroundComposition = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill>
			<Background />
			<Sequence name="word-list" from={FPS}>
				{WORD_LIST.map((word, index) => {
					const {item} = word;
					return (
						<Sequence key={item} from={index * fps} name={item}>
							<SingleWord word={word} index={index} />
						</Sequence>
					);
				})}
			</Sequence>
		</AbsoluteFill>
	);
};
