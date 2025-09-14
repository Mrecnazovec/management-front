'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import AOSComponent from '@/lib/aos'

dayjs.extend(duration)

type TimeLeft = {
	days: number
	hours: number
	minutes: number
	seconds: number
}

const declension = (num: number, words: [string, string, string]) => {
	return words[num % 100 > 4 && num % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]]
}

export default function CountdownTimer() {
	const deadline = dayjs('2026-02-23T23:59:59')

	const [timeLeft, setTimeLeft] = useState<TimeLeft>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	})

	useEffect(() => {
		const updateTimer = () => {
			const now = dayjs()
			const diff = deadline.diff(now)

			if (diff <= 0) {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
				return
			}

			const d = dayjs.duration(diff)

			setTimeLeft({
				days: Math.floor(d.asDays()),
				hours: d.hours(),
				minutes: d.minutes(),
				seconds: d.seconds(),
			})
		}

		updateTimer()
		const interval = setInterval(updateTimer, 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<AOSComponent>
			<div className='flex justify-center items-center flex-col bg-white text-main mb-14' data-aos='fade-up'>
				<h2 className='sm:text-4xl text-2xl mb-6 text-center'>До 20-летия Ташкентского филиала МГУ осталось:</h2>
				<div className='flex items-center sm:text-5xl text-3xl text-center gap-4'>
					<div className='relative'>
						<span>{String(timeLeft.days).padStart(2, '0')}</span>
						<div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-base'>{declension(timeLeft.days, ['день', 'дня', 'дней'])}</div>
					</div>
					<div>:</div>
					<div className='relative'>
						<span>{String(timeLeft.hours).padStart(2, '0')}</span>
						<div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-base'>{declension(timeLeft.hours, ['час', 'часа', 'часов'])}</div>
					</div>
					<div>:</div>
					<div className='relative'>
						<span>{String(timeLeft.minutes).padStart(2, '0')}</span>
						<div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-base'>
							{declension(timeLeft.minutes, ['минута', 'минуты', 'минут'])}
						</div>
					</div>
					<div>:</div>
					<div className='relative'>
						<span>{String(timeLeft.seconds).padStart(2, '0')}</span>
						<div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-base'>
							{declension(timeLeft.seconds, ['секунда', 'секунды', 'секунд'])}
						</div>
					</div>
				</div>
			</div>
		</AOSComponent>
	)
}
