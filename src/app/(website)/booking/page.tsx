import { BookingTabs } from "./_components/booking-tabs";

const Page = () => {
  return (
    <main className="flex  container mx-auto  min-h-[80vh] px-4 my-[100px] mt-[120px] md:mt-[200px]">
      {/* <h1 className="text-3xl font-bold text-center mb-8">BOOK NOW!</h1> */}
      <BookingTabs />
    </main>
  );
};

export default Page;
