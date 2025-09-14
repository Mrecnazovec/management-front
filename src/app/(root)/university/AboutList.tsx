import AOSComponent from '@/lib/aos'
import { ListSvg } from './svg/ListSvg'

export function AboutList() {
	return (
		<AOSComponent>
			<ul className='mb-14'>
				<li className='flex justify-between items-center md:gap-8 mb-8 md:flex-row flex-col gap-4' data-aos='fade-left'>
					<ListSvg variant='one' startColor='bg-main' endColor='bg-secondary' />
					<p className='text-base'>
						Отличительной чертой программы «Бакалавр менеджмента» является широта подготовки. Каждый студент программы должен освоить основы наук об
						управлении: введение в менеджмент, экономика, стратегический менеджмент, операционный менеджмент, управление персоналом, правовая среда
						бизнеса, управление проектами, основам маркетинга, государственному управлению и т.д.
					</p>
				</li>
				<li className='flex justify-between items-center gap-8 mb-8 max-md:flex-col' data-aos='fade-right'>
					<ListSvg variant='two' startColor={'bg-main'} endColor={'bg-secondary'} className='md:order-2' />
					<p className='text-base md:text-end'>
						Современный менеджер обязан владеть культурой работы с данными — для этого читаются курсы математики, теории вероятностей, статистики,
						анализа данных, эконометрики.
					</p>
				</li>
				<li className='flex justify-between items-center md:gap-8 mb-8 md:flex-row flex-col gap-4' data-aos='fade-left'>
					<ListSvg variant='three' startColor={'bg-main'} endColor={'bg-secondary'} />
					<p className='text-base'>
						Для ориентации в современной динамичной экономике студентам программы предлагаются курсы по информационным технологиям, цифровой
						бизнес-среде, архитектуре цифровых предприятия и по цифровым трансформациям отраслей экономики.
					</p>
				</li>
				<li className='flex justify-between items-center gap-8 mb-8 max-md:flex-col' data-aos='fade-right'>
					<ListSvg variant='four' startColor={'bg-main'} endColor={'bg-secondary'} className='md:order-2' />
					<p className='text-base md:text-end'>
						Отдельное внимание на программе «Бакалавр менеджмента» уделяется развитию социальных навыков студентов. Каждый студент слушает
						обязательные курсы социальной психологии, культуре речи и деловым коммуникациям.
					</p>
				</li>
				<li className='flex justify-between items-center md:gap-8 mb-8 md:flex-row flex-col gap-4' data-aos='fade-left'>
					<ListSvg variant='five' startColor={'bg-main'} endColor={'bg-secondary'} />
					<p className='text-base'>
						На третьем году обучения каждый студент может выбрать дисциплины из нескольких гибких траекторий: Цифровой Маркетинг; Цифровые Таланты;
						Цифровые Финансы; Цифровые стратегии.
					</p>
				</li>
			</ul>
		</AOSComponent>
	)
}
