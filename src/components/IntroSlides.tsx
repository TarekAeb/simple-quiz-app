import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSlidesProps {
  currentSlide: number;
  onNextSlide: () => void;
  onSkipIntro: () => void;
}

const IntroSlides: React.FC<IntroSlidesProps> = ({
  currentSlide,
  onNextSlide,
  onSkipIntro,
}) => {
  return (
    <div className="w-full max-w-5xl px-4">
      <AnimatePresence mode="wait">
        {currentSlide === 0 && <TitleSlide key="slide1" onNext={onNextSlide} />}

        {currentSlide === 1 && (
          <IntroductionSlide key="slide2" onNext={onNextSlide} />
        )}

        {currentSlide === 2 && <RulesSlide key="slide3" onNext={onSkipIntro} />}
      </AnimatePresence>
    </div>
  );
};

const slideVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const TitleSlide: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <motion.div
      className="bg-white bg-algerian-pattern bg-opacity-98 rounded-2xl shadow-xl p-10 md:p-12 w-full text-center"
      initial="enter"
      animate="center"
      exit="exit"
      variants={slideVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.img
          src="https://upload.wikimedia.org/wikipedia/commons/6/66/%D8%B9%D8%A8%D8%AF-%D8%A7%D9%84%D8%AD%D9%85%D9%8A%D8%AF-%D8%A5%D8%A8%D9%86-%D8%A8%D8%A7%D8%AF%D9%8A%D8%B3.jpg"
          alt="الشيخ عبد الحميد بن باديس"
          className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full mx-auto mb-6 shadow-lg ring-2 ring-algerian-gold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <h1 className="text-4xl md:text-5xl font-bold text-algerian-green-dark mb-4">
          مسابقة يوم العلم
        </h1>

        <h2 className="text-xl md:text-2xl text-islamic-blue mb-8">
          تكريمًا للشيخ عبد الحميد بن باديس والسعي نحو المعرفة
        </h2>

        <div className="text-lg text-algerian-green-light mb-2">مقدمة من</div>
        <div className="text-xl font-medium mb-6 text-islamic-blue-dark">{`الإقامة الجامعية معالمة  بالتنسيق مع عبد البارئ طارق`}</div>

        <div className="text-md text-algerian-green mb-8">
          {formatDate(new Date())}
        </div>

        <motion.button
          className="bg-algerian-gold text-algerian-green-dark px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-scholar-amber transition-colors duration-300 hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
        >
          <span>متابعة</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

const IntroductionSlide: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <motion.div
      className="bg-white bg-algerian-pattern bg-opacity-98 rounded-2xl shadow-xl p-10 md:p-12 w-full"
      initial="enter"
      animate="center"
      exit="exit"
      variants={slideVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-algerian-green-dark mb-8 text-center">
          أهلاً وسهلاً بكم في مسابقة يوم العلم!
        </h2>

        <div className="space-y-4 text-lg mb-8 text-islamic-blue-dark">
          <p className="leading-relaxed">
            <em className="text-algerian-red font-bold">السلام عليكم</em> ورحمة الله وبركاته، وأهلاً وسهلاً بكم في
            احتفالنا بيوم العلم!
          </p>

          <p className="leading-relaxed">
            نحتفل اليوم، 16 أبريل، بيوم العلم، وهو يوم ذو أهمية كبيرة في الجزائر
            والعالم الإسلامي أجمع.
          </p>

          <p className="leading-relaxed">
            هذا اليوم يحيي ذكرى الشيخ عبد الحميد بن باديس، الشخصية البارزة في
            حركة الإصلاح الإسلامي في الجزائر، وجهوده الدؤوبة لتعزيز التعليم
            والتفكير النقدي وإحياء التراث الثقافي.
          </p>

          <p className="leading-relaxed">
            يوم العلم هو تذكير بالإرث الفكري الغني للحضارة الإسلامية ودعوة للعمل
            لنا لمواصلة السعي وراء المعرفة والمساهمة في تحسين المجتمع.
          </p>

          <p className="leading-relaxed">
            يسعدنا مشاركتكم في هذه المسابقة، المصممة لاختبار معلوماتكم وتحفيز
            عقولكم والاحتفال بروح الاستكشاف.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            className="bg-algerian-gold text-algerian-green-dark px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-scholar-amber transition-colors duration-300 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
          >
            <span>متابعة</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const RulesSlide: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <motion.div
      className="bg-white bg-algerian-pattern bg-opacity-98 rounded-2xl shadow-xl p-10 md:p-12 w-full"
      initial="enter"
      animate="center"
      exit="exit"
      variants={slideVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-algerian-green-dark mb-8 text-center">
          إرشادات المسابقة
        </h2>

        <div className="space-y-3 text-lg mb-8 text-islamic-blue-dark">
          <p className="leading-relaxed">
            ستتكون هذه المسابقة من <strong>مرحلتين</strong>، تحتوي كل مرحلة على
            أسئلة اختيار من متعدد:
          </p>

          <div className="pl-4 border-l-4 border-algerian-green-light my-4 py-2 bg-algerian-green-light/5 rounded-r-lg">
            <h3 className="font-bold text-xl mb-2 text-algerian-green-dark">
              المرحلة الأولى: أسئلة بالتناوب
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-right">
              <li>تتناوب الفرق في الإجابة على الأسئلة</li>
              <li>يتاح لكل فريق 30 ثانية للإجابة على السؤال</li>
              <li>تُمنح نقطة واحدة لكل إجابة صحيحة</li>
            </ul>
          </div>

          <div className="pl-4 border-l-4 border-algerian-gold my-4 py-2 bg-algerian-gold/5 rounded-r-lg">
            <h3 className="font-bold text-xl mb-2 text-islamic-blue-dark">
              المرحلة الثانية: جولة السرعة
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>يتنافس كلا الفريقين للإجابة أولاً</li>
              <li>يحصل الفريق الأول الذي يختار الإجابة الصحيحة على نقطة</li>
              <li>سيتم تمييز الإجابات غير الصحيحة</li>
            </ul>
          </div>

          <p className="leading-relaxed">
            سيتم تقديم الأسئلة بترتيب تصاعدي للصعوبة.
          </p>

          <p className="leading-relaxed">
            سيتم إعلان الفريق الحائز على أعلى مجموع نقاط في نهاية المرحلتين
            فائزًا!
          </p>

          <p className="leading-relaxed font-medium text-center mt-6 text-algerian-green">
            حظًا سعيدًا لجميع الفرق!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            className="bg-algerian-gold text-algerian-green-dark px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-scholar-amber transition-colors duration-300 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
          >
            <span>ابدأ المسابقة</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions
function getCurrentUser() {
  return "TarekAeb"; // إرجاع اسم المستخدم الحالي
}

function formatDate(date: Date) {
  // Since today is April 14, 2025, and the event is on April 16, show how many days left
  return "16 أبريل 2025 (بعد يومين)"; // تنسيق التاريخ حسب الحاجة
}

export default IntroSlides;