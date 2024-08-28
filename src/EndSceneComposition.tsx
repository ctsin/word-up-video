import {
	AbsoluteFill,
	continueRender,
	delayRender,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {BACKGROUND_COLOR, flexCenter} from './Root';
import {useEffect, useMemo, useState} from 'react';
import {FontData, getOpenType} from './helper/openType';
import {evolvePath, getBoundingBox} from '@remotion/paths';
import {TENTION} from './data';

export const EndScene = () => {
	const frame = useCurrentFrame();
	const [path, setPath] = useState<FontData>(null!);
	const handle = useMemo(() => delayRender(), []);
	const linearGradientId = useMemo(() => String(random(null)), []);
	const [viewBox, setViewBox] = useState<string>(null!);
	const progress = interpolate(frame, [20, 70], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const opacity = interpolate(progress, [0, 1], [0, 1]);

	const strokeDashOpacity = interpolate(frame, [10, 25, 50], [0, 1, 0]);

	useEffect(() => {
		getOpenType(staticFile('Tinos-Bold.ttf'), TENTION.affix)
			.then((p) => {
				setPath(p);
				setViewBox(() => getBoundingBox(p.path).viewBox);

				continueRender(handle);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [handle]);

	const {
		strokeDasharray,
		strokeDashoffset,
	}: {strokeDasharray?: string; strokeDashoffset?: number} = useMemo(() => {
		if (!path) {
			return {};
		}

		const {strokeDasharray, strokeDashoffset} = evolvePath(progress, path.path);
		return {
			strokeDasharray,
			strokeDashoffset,
		};
	}, [path, progress]);

	return (
		<AbsoluteFill style={{...flexCenter, background: BACKGROUND_COLOR}}>
			{path && (
				<svg style={{height: 160}} viewBox={viewBox}>
					<defs>
						<linearGradient
							id={linearGradientId}
							stopColor="#fff"
							stopOpacity={1}
							gradientTransform="rotate(45)"
						>
							<stop stopColor="#d5d5d5" stopOpacity={opacity} offset="0%" />
							<stop stopColor="#bdbdbd" stopOpacity={opacity} offset="100%" />
						</linearGradient>
					</defs>
					<path
						d={path.path}
						fill="transparent"
						stroke="rgba(255, 255, 255, 0.02)"
						strokeWidth={0.1}
					/>
					<path d={path.path} fill={`url(#${linearGradientId})`} />
					<path
						d={path.path}
						stroke={`rgba(255, 255, 255, ${strokeDashOpacity})`}
						strokeWidth={0.1}
						strokeDasharray={strokeDasharray}
						strokeDashoffset={strokeDashoffset}
						fill="transparent"
						filter="blur(0.04px)"
					/>
				</svg>
			)}
		</AbsoluteFill>
	);
};
