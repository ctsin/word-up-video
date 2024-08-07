import {
	AbsoluteFill,
	Audio,
	interpolate,
	interpolateColors,
	Sequence,
	Series,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import * as Tinos from '@remotion/google-fonts/Tinos';
import * as NotoSansSC from '@remotion/google-fonts/NotoSansSC';
const {fontFamily: TinosFontFamily} = Tinos.loadFont();
const {fontFamily: NotoSansSCFontFamily} = NotoSansSC.loadFont();

import {
	COLOR,
	FPS,
	HIGHLIGHT,
	PhoneticSign,
	secondaryBaseStyle,
	useLeft,
} from './Root';

const Background = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enterFrame = spring({
		frame,
		fps,
		config: {
			damping: 200,
		},
	});
	const backgroundColor = interpolateColors(
		enterFrame,
		[0, 1],
		['white', '#D9DFE2']
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
	word: {
		item: {body = '', prefix, suffix = ''},
		meaning,
		phonetic: {
			prefix: phoneticPrefix = '',
			body: phoneticBody,
			suffix: phoneticSuffix = '',
		},
		mp3: {EN = '', US = ''},
	},
	index,
}: SingleWordProps) => {
	const fontSize = 40;
	const itemFontSize = fontSize * 3;
	const rowHeight = fontSize * 8;
	const left = useLeft();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numberEnter = spring({frame, fps, config: {damping: 200}});
	const y = interpolate(numberEnter, [0, 1], [rowHeight, 0]);
	const opacity = interpolate(numberEnter, [0, 1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `translateY(${y}px)`,
				fontSize,
				fontFamily: TinosFontFamily,
				color: COLOR,
				top: ++index * rowHeight,
				opacity,
			}}
		>
			<Series>
				{EN && (
					<Series.Sequence
						offset={FPS}
						durationInFrames={FPS * 2}
						name="pronunciation"
						layout="none"
					>
						<Audio src={EN} name={`${prefix + body + suffix} EN`} />
					</Series.Sequence>
				)}
				{US && (
					<Series.Sequence
						durationInFrames={FPS * 2}
						name="pronunciation"
						layout="none"
					>
						<Audio src={US} name={`${prefix + body + suffix} US`} />
					</Series.Sequence>
				)}
			</Series>
			<div
				style={{
					position: 'absolute',
					fontSize: itemFontSize,
					fontWeight: 700,
					left,
					top: 0,
				}}
			>
				<div style={{position: 'absolute', top: 0, right: '100%'}}>
					{prefix}
					<div
						style={{
							position: 'absolute',
							top: itemFontSize,
							right: 0,
							fontSize,
							whiteSpace: 'nowrap',
						}}
					>
						<PhoneticSign />
						{phoneticPrefix}
					</div>
				</div>
				<div style={{color: HIGHLIGHT}}>
					{body}
					<div
						style={{position: 'absolute', fontSize, top: itemFontSize, left: 0}}
					>
						{phoneticBody}

						{!phoneticSuffix && <PhoneticSign />}
					</div>
					<div
						style={{
							...secondaryBaseStyle,
							position: 'absolute',
							top: fontSize * 4.5,
							left: 0,
							fontFamily: NotoSansSCFontFamily,
							fontSize: fontSize * 0.8,
							whiteSpace: 'nowrap',
						}}
					>
						{meaning.join('，')}
					</div>
				</div>
				<div style={{position: 'absolute', top: 0, left: '100%'}}>
					{suffix}
					{phoneticSuffix && (
						<div
							style={{
								position: 'absolute',
								fontSize,
								top: itemFontSize,
								left: 0,
								whiteSpace: 'nowrap',
							}}
						>
							{phoneticSuffix}
							<PhoneticSign />
						</div>
					)}
				</div>
			</div>
		</AbsoluteFill>
	);
};

type WordProps = {
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
};

const WORD_LIST: WordProps[] = [
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

export const PlaygroundComposition = () => {
	return (
		<AbsoluteFill>
			<Background />
			<Sequence
				name="word-list"
				from={FPS}
				layout="none"
				showInTimeline={false}
			>
				{WORD_LIST.map((word, index) => {
					const {
						item: {prefix = '', body, suffix = ''},
					} = word;
					const name = prefix + body + suffix;

					return (
						<Sequence key={name} from={index * FPS * 6} name={name}>
							<SingleWord word={word} index={index} />
						</Sequence>
					);
				})}
			</Sequence>
		</AbsoluteFill>
	);
};
