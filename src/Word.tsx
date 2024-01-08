import {
	AbsoluteFill,
	Audio,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {WordProps} from './Words';

const joiner = '，';

export const Word = (props: {word: WordProps}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const curve = spring({
		fps,
		frame,
		config: {
			damping: 20,
		},
	});

	const translateY = interpolate(curve, [0, 1], [0, -40], {
		extrapolateRight: 'clamp',
	});

	const opacity = interpolate(curve, [0, 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				translate: `0 ${translateY}px`,
				opacity,
				flexDirection: 'row',
				padding: 50,
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					width: '100%',
				}}
			>
				{props.word.type === 'phonetic' && (
					<div style={{fontSize: 66, lineHeight: 1}}>{props.word.phonetic}</div>
				)}

				{props.word.type === 'definition' && (
					<>
						<div style={{fontSize: 66, lineHeight: 1}}>
							<Highlight
								source={props.word.word}
								predict={props.word.predict}
							/>
						</div>
						<div style={{display: 'flex', fontSize: 38}}>
							{props.word.definitions.join(joiner)}
						</div>
						<Audio
							src={`https://api.dictionaryapi.dev/media/pronunciations/en/${props.word.word}-uk.mp3`}
						/>
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};

const Highlight = ({source, predict}: {source: string; predict: string}) =>
	[...source].map((letter) => {
		const predictArray = [...predict];

		if (predictArray.includes(letter)) {
			return <span style={{color: '#f00056'}}>{letter}</span>;
		}

		return letter;
	});