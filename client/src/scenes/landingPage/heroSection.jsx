import heroImg from './assets/heroImg.png';

const HeroSection = () => {
  return (
    <section className="w-full p-4">
      <div className="md:max-w-[1100px] m-auto grid md:grid-cols-2 max-w-[400px]">
        <div className="flex flex-col justify-start gap-4">
          <p className="py-8 text-4xl text-[#208486] font-bold">
            {'BUILD YOUR RESUME NOW'}
          </p>
          <h1 className="md:leading-[42px] py-2 md:text-3xl text-lg font-semibold">
            Utilize the power of AI to elevate your career{' '}
            <span className="text-[#208486]">today</span>
          </h1>
          <p className="py-2 text-lg text-gray-900">
            With our powerful resume builder, you can create a professional resume in minutes. Land more interviews with our AI powered tools and get hired faster.
          </p>
        </div>
        <img src={heroImg} alt="hero" className="md:order-last order-first" />
      </div>
    </section>
  );
};

export default HeroSection;
