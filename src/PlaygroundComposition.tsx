import {
	AbsoluteFill,
	Audio,
	interpolate,
	Sequence,
	Series,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import * as Tinos from '@remotion/google-fonts/Tinos';
import * as NotoSansSC from '@remotion/google-fonts/NotoSansSC';
const {fontFamily: TinosFontFamily} = Tinos.loadFont();
const {fontFamily: NotoSansSCFontFamily} = NotoSansSC.loadFont('normal', {
	weights: ['100'],
});

import {
	COLOR,
	EntranceDurationInFrames,
	FPS,
	HIGHLIGHT,
	itemDurationInFrames,
	PhoneticSign,
	secondaryBaseStyle,
	useLeft,
	WORD_LIST,
	WordProps,
} from './Root';

const Background = () => (
	<AbsoluteFill
		style={{
			backgroundColor: '#D9DFE2',
		}}
	/>
);

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

	const phoneticEnter = spring({
		frame: frame - 5,
		fps,
		config: {damping: 200},
	});
	const phoneticY = interpolate(phoneticEnter, [0, 1], [fontSize, 0]);
	const phoneticOpacity = interpolate(phoneticEnter, [0, 1], [0, 1]);

	const meaningEnter = spring({frame: frame - 10, fps, config: {damping: 200}});
	const meaningY = interpolate(meaningEnter, [0, 1], [fontSize, 0]);
	const meaningOpacity = interpolate(meaningEnter, [0, 1], [0, 1]);

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
							transform: `translateY(${phoneticY}px)`,
							opacity: phoneticOpacity,
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
						style={{
							transform: `translateY(${phoneticY}px)`,
							opacity: phoneticOpacity,
							position: 'absolute',
							fontSize,
							top: itemFontSize,
							left: 0,
						}}
					>
						{phoneticBody}

						{!phoneticSuffix && <PhoneticSign />}
					</div>
					<div
						style={{
							...secondaryBaseStyle,
							transform: `translateY(${meaningY}px)`,
							opacity: meaningOpacity,
							position: 'absolute',
							top: fontSize * 4.5,
							left: 0,
							fontFamily: NotoSansSCFontFamily,
							fontWeight: '100',
							fontSize: fontSize * 0.8,
							whiteSpace: 'nowrap',
						}}
					>
						{meaning.join('，')}
					</div>
				</div>
				<div
					style={{
						transform: `translateY(${phoneticY}px)`,
						opacity: phoneticOpacity,
						position: 'absolute',
						top: 0,
						left: '100%',
					}}
				>
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

export const PlaygroundComposition = () => {
	return (
		<AbsoluteFill>
			<Background />
			<Sequence
				name="word-list"
				from={EntranceDurationInFrames}
				layout="none"
				showInTimeline={false}
			>
				{WORD_LIST.map((word, index) => {
					const {
						item: {prefix = '', body, suffix = ''},
					} = word;
					const name = prefix + body + suffix;

					return (
						<Sequence
							key={name}
							from={index * itemDurationInFrames}
							name={name}
						>
							<SingleWord word={word} index={index} />
						</Sequence>
					);
				})}
			</Sequence>
		</AbsoluteFill>
	);
};
