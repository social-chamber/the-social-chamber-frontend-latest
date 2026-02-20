import Image from "next/image"

export default function AsSeen() {
  const logos = [
    {
      src: "/img/aso1.png",
      alt: "MyGuide Singapore",
      width: 200,
      height: 80,
    },
    {
      src: "/img/aso2.png",
      alt: "Confirm Good",
      width: 200,
      height: 80,
    },
    {
      src: "/img/aso3.png",
      alt: "The Vent Machine",
      width: 200,
      height: 80,
    },
    {
      src: "/img/aso4.png",
      alt: "Money FM 89.3",
      width: 200,
      height: 80,
    },
    {
      src: "/img/aso5.png",
      alt: "House Search Icon",
      width: 200,
      height: 80,
    },
    {
      src: "/img/aso6.png",
      alt: "Great New Places",
      width: 200,
      height: 80,
    },
  ]

  return (
    <section className="w-full bg-white pt-[50px] md:pt-[50px] lg:pt-[50px] pb-[40px] md:pb-[62px] lg:pb-[83px]">
      <div className="container mx-auto">
        <h2 className="font-poppins text-4xl md:text-[40px] lg:text-[48px] font-semibold text-center text-[#FF6900] mb-10 md:mb-[60px] lg:mb-[80px]">As Seen On</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="relative h-16 sm:h-20 w-full">
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
