import { Container } from '@/components/ui/Container'
import CountUp from 'react-countup'

export function NumberSection() {
	return (
		<Container className=''>
			<h2 className='text-center text-4xl mb-15'>Менеджмент в числах</h2>
			<div className='flex justify-around flex-row max-[470px]:flex-col items-center gap-4 flex-wrap mb-25'>
				<div className='w-fit flex flex-col items-center justify-center'>
					<div className='flex items-center justify-center rounded-full md:size-[180px] size-[130px] bg-gradient-to-b from-main to-secondary mb-2'>
						<div className='flex items-center justify-center rounded-full size-[90%] bg-white'>
							<CountUp end={4} className='text-3xl'></CountUp>
						</div>
					</div>
					<p className='text-center text-2xl'>Года обучения</p>
				</div>
				<div className='w-fit flex flex-col items-center justify-center'>
					<div className='flex items-center justify-center rounded-full md:size-[180px] size-[130px] bg-gradient-to-b from-main to-secondary mb-2'>
						<div className='flex items-center justify-center rounded-full size-[90%] bg-white'>
							<span className='text-3xl'>{'>'}</span>
							<CountUp end={50} className='text-3xl'></CountUp>
						</div>
					</div>
					<p className='text-center text-2xl'>Предметных курсов</p>
				</div>
				<div className='w-fit flex flex-col items-center justify-center'>
					<div className='flex items-center justify-center rounded-full md:size-[180px] size-[130px] bg-gradient-to-b from-main to-secondary mb-2'>
						<div className='flex items-center justify-center rounded-full size-[90%] bg-white'>
							<span className='text-3xl'>{'>'}</span>
							<CountUp end={130} className='text-3xl'></CountUp>
						</div>
					</div>
					<p className='text-center text-2xl'>Студентов</p>
				</div>
			</div>
			<div className='border-b-2 border-b-paragraph/30'></div>
		</Container>
	)
}
