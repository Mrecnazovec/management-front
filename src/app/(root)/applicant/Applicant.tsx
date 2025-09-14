'use client'

import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { PATH_URL } from '@/config/url.config'
import dynamic from 'next/dynamic'
import AOSComponent from '@/lib/aos'

const FormModal = dynamic(() => import('@/components/ui/modals/FormModal'))

interface Props {
	className?: string
}

function P({ children, className }: PropsWithChildren<Props>) {
	return <p className={cn('text-xl mb-4', className)}>{children}</p>
}

function Span({ children, className }: PropsWithChildren<Props>) {
	return <span className={cn('text-base mb-4 text-paragraph block', className)}>{children}</span>
}

function Li({ children, className }: PropsWithChildren<Props>) {
	return (
		<li className={cn('flex items-center mb-4 relative pl-8.5', className)}>
			<div className='w-6 h-[2px] bg-secondary absolute left-0 top-3'></div>
			<p className='text-paragraph'>{children}</p>
		</li>
	)
}

interface LinkProps {
	href: string
	className?: string
}

function A({ children, href, className }: PropsWithChildren<LinkProps>) {
	return (
		<Link href={href} className={cn('text-link underline hover:opacity-80 transition-opacity', className)}>
			{children}
		</Link>
	)
}

export function Applicant() {
	return (
		<AOSComponent>
			<Container>
				<h1 className='sr-only'>Абитуриентам</h1>
				<h2 className='text-center sm:text-3xl text-xl mb-4' data-aos='fade-up'>
					Информация для абитуриентов направления «Менеджмент»
				</h2>
				<p className='sm:text-xl text-base text-center mb-8' data-aos='fade-up'>
					Уважаемый абитуриент!
				</p>
				<div className='flex items-center gap-14 mb-8 max-lg:flex-col' data-aos='fade-up'>
					<Image
						src={PATH_URL.jpg('applicant.jpg')}
						alt='Абитуриентка'
						width={4080}
						height={3060}
						className='aspect-[16/9] rounded-2xl object-cover lg:max-w-[40%]'
					/>
					<p className='lg:max-w-[560px] leading-[38px] text-xl'>
						Сроки приёма документов на обучение в 2025/2026 учебном году — с 20 июня c 10:00 по 10 июля 2025 года. <br /> <br /> Списки поступающих,
						успешно прошедших вступительные испытания, будут опубликованы не позднее 20 августа 2025 года.
					</p>
				</div>
				<div data-aos='fade-up'>
					<P>Подать документы в Филиал МГУ в городе Ташкенте можно:</P>
					<ul>
						<Li>
							через систему дистанционной подачи документов МГУ – <A href='https://webanketa.msu.ru/index.php?ckattempt=1'>webanketa.msu.ru</A>
						</Li>
						<Li>лично в приемную комиссию Филиала МГУ в городе Ташкенте.</Li>
					</ul>
					<A
						className='mb-4 block'
						href='https://msu.dvaoblaka.ru/media/2025/06/684ae19e33e1f_График%20работы%20приёмной%20комиссии%20Филиала%20МГУ-2025.pdf'
					>
						График работы приемной комиссии с 20 июня по 10 июля 2025 года.
					</A>
					<p className='text-xl font-semibold mb-4'>
						Памятка абитуриенту для подачи заявления через электронную информационную систему МГУ – webanketa.msu.ru (
						<A href='https://msu.dvaoblaka.ru/media/2022/06/62b6d8e9b00b6_Памятка%20по%20web-anketa.pdf'>скачать</A>)
					</p>
					<P>Вступительные экзамены:</P>
					<ul>
						<Li>Математика (письменно)</Li>
						<Li>Русский язык (письменно)</Li>
					</ul>
					<A href='https://t.me/tfmsu_exams' className='mb-4 block no-underline'>
						Варианты экзаменов прошлых лет
					</A>
					<P>Контрольные цифры приема на 2025-2026 учебный год:</P>
					<Span className='mb-4 block'>50 мест, в том числе 10 мест за счет государственного бюджета.</Span>
					<P className='mb-4'>Прием документов – с 20 июня по 10 июля.</P>
					<Span>Начало всех вступительных испытаний в 9:00.</Span>
					<Span>
						Место проведение вступительных испытаний:{' '}
						<A href='https://yandex.uz/maps/-/CDqKQYM-' className='text-paragraph'>
							здание Филиала МГУ в городе Ташкенте.
						</A>
					</Span>
					<Span>
						Адрес:{' '}
						<A href='https://yandex.uz/maps/-/CDqKQYM-' className='text-paragraph'>
							100060, Узбекистан, Ташкент, пр. Амира Темура дом 22.
						</A>
					</Span>
					<Image
						src={PATH_URL.jpg('schedule-exams.jpg')}
						alt='Расписание вступительных экзаменов'
						width={800}
						height={500}
						className='max-w-full h-auto object-cover mx-auto mb-4'
					/>
					<P>
						<span id='docs'>Перечень необходимых документов:</span>
					</P>
					<ul className='mb-4'>
						<Li>
							заявление (через электронную информационную систему МГУ – <A href='https://webanketa.msu.ru/'>webanketa.msu.ru</A>.);
						</Li>
						<Li>
							оригинал и копия паспорта (ID карта и регистрация (прописка)) с{' '}
							<span className='text-danger'>нотариальным переводом на русский язык</span>. (необходимо загрузить сканы следующих страниц: оригинал
							паспорта и копию паспорта с <span className='text-danger'>нотариальным переводом на русский язык</span>, действующая регистрация
							(прописка) с<span className='text-danger'>нотариальным переводом на русский язык</span> (при наличии, обычно второй разворот паспорта);
						</Li>
					</ul>
					<Span className='text-danger'>Примечание:</Span>
					<Span className='text-danger'>
						Если ID карта, то необходимо нотариальный перевод на русский язык ID карты и дополнительный листок регистрации (прописки);Вам необходимо
						кроме нотариального перевода на русский язык ID-карты и дополнительного листка регистрации (прописки) ЗАГРУЗИТЬ в раздел документ,
						удостоверяющего личность ЗАЯВЛЕНИЕ (
						<A href='https://msu.dvaoblaka.ru/media/2022/06/62b70b1f5217b_%D0%94%D0%9B%D0%AF%20%D0%A2%D0%95%D0%A5%20%D0%A3%20%D0%9A%D0%9E%D0%93%D0%9E%20%D0%90%D0%98%CC%86%D0%94%D0%98.docx'>
							скачать шаблон заявления
						</A>
						) с указанием вашей имени и фамилии латинскими буквами (на английском языке).
					</Span>
					<ul className='mb-4'>
						<Li>
							оригинал документа государственного образца об образовании. (Необходимо загрузить сканы следующих страниц: разворот диплома с номером,
							ФИО и сведениями об учебном заведении, приложение к диплому полностью (две-четыре страницы));
						</Li>
					</ul>
					<Span className='text-danger'>Примечание:</Span>
					<Span className='text-danger'>
						Для школьного аттестата - нотариальный перевод не требуется;Для диплома лицея и колледжа необходимо нотариальный перевод самого диплома и
						приложение к диплому на русский язык;
					</Span>
					<ul className='mb-4'>
						<Li>
							файл формата JPEG или PNG (разрешение 300 точек на дюйм), содержащий ОДНУ фотографию размера 3×4 см (черно-белый или цветной снимок без
							головного убора, сделанный в 2025 году). При несоответствии размеров, фотография может быть обрезана.
						</Li>
					</ul>
					<P className='font-semibold mb-14'>Обращаем ваше внимание, что филиал МГУ в городе Ташкенте не имеет общежития для проживания студентов.</P>

					<P className='text-danger'>Перевод в Филиал МГУ в городе Ташкенте на обучение по программам бакалавриата</P>
					<P>Перечень необходимых документов:</P>

					<ul className='mb-4'>
						<Li>
							заявление (
							<A href='https://msu.dvaoblaka.ru/media/2022/06/62a07e3d3ef46_%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20(%D0%A0%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D1%83%20%D0%9C%D0%93%D0%A3).docx'>
								шаблон заявления
							</A>
							);
						</Li>
						<Li>копия паспорта (ID карта) с нотариальным переводом на русский язык;</Li>
						<Li>
							отсканированный оригинал академической справки (справки о периоде обучения) установленного образца и копия зачетной книжки, заверенная в
							образовательной организации высшего образования, в которой осуществляется обучение;
						</Li>
						<Li>
							отсканированный оригинал документа государственного образца об образовании. (отсканированные страницы: 1. Разворот диплома с номером,
							ФИО и сведениями об учебном заведении, 2. Приложение к диплому полностью.)
						</Li>
						<Li>
							файл формата JPEG или PNG (разрешение 300 точек на дюйм), содержащий одну фотографию размера 3×4 см (черно-белый или цветной снимок без
							головного убора, сделанный в 2025 году).
						</Li>
					</ul>
					<Span>
						Необходимо отправить все отсканированные вышеперечисленные документы на почту <A href='mailto:exam@msu.uz'>exam@msu.uz</A>
					</Span>
					<Span className='font-semibold mb-4'>
						Перевод в Филиал МГУ в городе Ташкенте проводится с учетом <span className='text-danger'>результатов аттестационных испытаний</span>.
					</Span>
					<Span className='font-semibold mb-14'>
						Дата аттестационного испытания : <span className='text-danger'>28 июля 2025 г.</span>.
					</Span>
					<P className='font-semibold'>
						Стоимость обучения на платно-контрактной основе в Филиале МГУ имени М.В. Ломоносова в г. Ташкенте на 2025-2026 учебный год составляет
					</P>
					<ul className='mb-14'>
						<Li>39 900 000 сум (без стипендии) для граждан Республики Узбекистан.</Li>
						<Li>43 700 000 сум (без стипендии) для иностранных граждан.</Li>
					</ul>
					<P className='font-semibold'>Информация о консультации к вступительным экзаменам</P>
					<Span>
						Каждому абитуриенту на электронную почту, указанную при регистрации в системе «ВЕБ-Анкета», будет отправлено приглашение на консультацию.
					</Span>
					<Span className='text-danger'>Если Вы не получили приглашения, проверьте папку «СПАМ».</Span>
					<Span>Вы должны подключиться к конференции ZOOM для прохождения процедуры идентификации.</Span>
					<Span className='font-semibold mb-14'>Консультации проводятся за день до вступительных испытаний.</Span>
					<ul className='mb-14'>
						<Li>
							Правила приема в МГУ имени М.В. Ломоносова в 2025 году (
							<A href='https://msu.dvaoblaka.ru/media/2025/06/684ae2c399e43_rules-2025.pdf'>скачать</A>)
						</Li>
						<Li>
							{' '}
							Правила подачи и рассмотрения апелляций (<A href='https://msu.dvaoblaka.ru/media/2025/06/684ae2df72105_apeal-2025.pdf'>скачать</A>)
						</Li>
						<Li>
							Состав приемной комиссии Филиала МГУ в городе Ташкенте (
							<A href='https://msu.dvaoblaka.ru/media/2025/06/684ae2fb026b4_СОСТАВ%20ПК-2025.pdf'>скачать</A>)
						</Li>
					</ul>
					<Span className='font-semibold text-black'>
						Адрес Филиала МГУ: <A href='https://yandex.uz/maps/-/CDqKQYM-'>100060, г. Ташкент, Мирабадский район, проспект Амира Темура, 22.</A>
					</Span>
					<Span>(Ориентиры – Клиника Федоровича, Автодорожный институт, Музей искусств)</Span>
					{/* <P className='text-danger'>
					Телефон для справок приемной комиссии: <A href='tel:+998712391188'>+998-71-2391188</A>
				</P> */}
					<Span className='text-black'>
						Дополнительный телефон для справок: <A href='tel:+9989712322811'>71-232-28-11</A> <A href='tel:+9989712322822'>71-232-28-22</A>
					</Span>
					<Span className='text-black'>
						Сайт: <A href='https://msu.uz/enrollee'>https://msu.uz/enrollee</A>
					</Span>
					<Span className='text-black mb-14'>
						<span id='commission'>Канал приемной комиссии в Telegram:</span>{' '}
						<A href='https://t.me/tf_msu_abiturient'>https://t.me/tf_msu_abiturient</A>
					</Span>
				</div>
				{/* <FormModal /> */}
			</Container>
		</AOSComponent>
	)
}
