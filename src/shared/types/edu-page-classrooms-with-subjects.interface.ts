export interface EduPageClassroomsWithSubjects {
	datefrom: string
	dateto: string
	classroomCount: number
	subjectCount: number
	classrooms: EduPageClassroomWithSubjects[]
}

export interface EduPageClassroomWithSubjects {
	id: string
	name: string
	subjects: EduPageClassroomSubject[]
}

export interface EduPageClassroomSubject {
	id: string
	name: string
	lessonCount: number
	lessons: EduPageClassroomLesson[]
}

export interface EduPageClassroomLesson {
	date: string
	starttime: string
	endtime: string
	subjectid: string
	classroomids: string[]
	teacherids: string[]
	uniperiod?: string
	classids?: string[]
	groupnames?: string[]
	durationperiods?: number
	colors?: string[]
}
