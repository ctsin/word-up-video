import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {FlexCenter, FPS, PHONETIC, useLeft} from './Root';
import {useEffect, useRef, useState} from 'react';

const WORD_LIST = ['retention', 'detention', 'attention'];

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

const PhoneticContainer = () => {
	const [width, setWidth] = useState(0);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			setWidth(ref.current.getBoundingClientRect().width);
		}
	}, []);

	return (
		<>
			<Sequence name="retrieve-width" durationInFrames={FPS} layout="none">
				<div
					ref={ref}
					style={{
						position: 'absolute',
						fontSize: 500,
						lineHeight: 0.6,
						visibility: 'hidden',
					}}
				>
					{PHONETIC}
				</div>
			</Sequence>
			<Sequence name="phonetic" from={FPS} style={{...FlexCenter}}>
				<Phonetic width={width} />
			</Sequence>
		</>
	);
};

interface PhoneticProps {
	width: number;
}

const Phonetic = ({width}: PhoneticProps) => {
	const factor = 5;
	const lastStep = [factor * 6, factor * 7];
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, factor], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(frame, [0, factor, ...lastStep], [6, 2, 2, 1], {
		extrapolateRight: 'clamp',
	});

	const top = interpolate(frame, lastStep, [0, -700], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const targetLeft = useLeft(width);
	const left = interpolate(frame, lastStep, [0, targetLeft], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'relative',
				fontSize: 200,
				lineHeight: 0.6,
				top,
				left,
				transform: `scale(${scale})`,
				color: 'white',
				opacity,
			}}
		>
			{PHONETIC}
		</div>
	);
};

interface SingleWordProps {
	word: string;
	index: number;
}

const SingleWord = ({word, index}: SingleWordProps) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numberEnter = spring({frame, fps, config: {damping: 200}});
	const y = interpolate(numberEnter, [0, 1], [20, 0]);
	const opacity = interpolate(numberEnter, [0, 1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `translateY(${y}px)`,
				fontSize: 40,
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				top: index * 30,
				opacity,
			}}
		>
			{word}
		</AbsoluteFill>
	);
};

export const PlaygroundComposition = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill>
			<Background />
			<PhoneticContainer />
			<Sequence name="word-list" from={FPS * 3}>
				{WORD_LIST.map((word, index) => (
					<Sequence key={word} from={index * fps} name={word}>
						<SingleWord word={word} index={index} />
					</Sequence>
				))}
			</Sequence>
		</AbsoluteFill>
	);
};
