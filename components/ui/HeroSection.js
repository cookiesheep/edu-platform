import Link from 'next/link';

export default function HeroSection() {
    return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-white mb-8 md:mb-0">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
                        个性化学习体验，<br/>AI 驱动的教育平台
                    </h1>
                    <p className="text-xl mb-6 text-primary-100">
                        我们利用人工智能打造个性化学习路径，帮助学生更高效地学习和进步
                    </p>
                    <div className="flex space-x-4">
                        <Link href="/courses" className="px-6 py-3 text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 shadow-md transition duration-300">
                            立即开始学习
                        </Link>
                        <Link href="/about" className="px-6 py-3 text-base font-medium rounded-md text-white border border-white hover:bg-white/10 transition duration-300">
                            了解更多
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="/hero-image.svg"
                        alt="智能学习平台"
                        className="max-w-md w-full"
                    />
                </div>
            </div>
        </div>
    );
}