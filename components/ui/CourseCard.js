import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CourseCard({ course, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
        >
            <div className="h-48 w-full overflow-hidden relative group">
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              {course.subject}
            </span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                    <span className="text-sm bg-primary-100 text-primary-700 py-1 px-2 rounded-full">
            {course.level}
          </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{course.chapters} 章节</span>
                    </div>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{course.studentsEnrolled.toLocaleString()} 名学生</span>
                    </div>
                </div>
                <Link href={`/courses/${course.id}`} className="block text-center bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition duration-300">
                    查看详情
                </Link>
            </div>
        </motion.div>
    );
}