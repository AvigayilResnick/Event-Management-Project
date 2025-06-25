import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">מי אנחנו?</h1>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        האתר שלנו נבנה כדי לעזור לך למצוא ספקים לאירועים מכל הסוגים – בקלות, במהירות, וביעילות.
        בין אם אתה מתכנן חתונה, בר מצווה, אירוע עסקי או מסיבה פרטית – אנחנו כאן כדי לחבר אותך עם האנשים הנכונים.
      </p>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        הספקים שלנו נבדקים בקפידה. אנחנו מציגים מידע שקוף, מחירים, ביקורות, ומאפשרים ליצור קשר ישיר.
      </p>

      <p className="text-gray-800 text-lg leading-relaxed mb-6">
        השירות שלנו חינמי לגמרי למשתמשים. הספקים יכולים להצטרף ולקבל פניות מלקוחות אמיתיים.
        אנחנו מאמינים בקלות שימוש, שקיפות, וחוויית משתמש מעולה.
      </p>

      <div className="mt-10 text-center">
        <span className="text-sm text-gray-500">
          גרסה 1.0 – האתר בפיתוח מתמשך
        </span>
      </div>
    </div>
  );
};

export default About;
