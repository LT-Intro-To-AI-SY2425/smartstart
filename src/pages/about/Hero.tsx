import { Button } from "../../components/Button";
import Waves from "../../components/Waves";
import { Mark } from "../../components/Logo";
import { NavLink } from "react-router";

export default function AboutHero() {
  return (
    <div className="hero-section flex flex-col space-between h-screen px-20 relative justify-center items-center gap-15 bg-zinc-900 overflow-hidden">
      {/* if we care (we dont), fix css vars not working for lineColor */}
      <Waves
        lineColor="oklch(0.442 0.017 285.786)"
        backgroundColor="var(--color-zinc-900)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        xGap={12}
        yGap={36}
      />
      <div className="z-50">
        <Mark className={"fill-gray-100 size-30"} />
      </div>
      <h1 className="text-6xl font-bold text-white z-10">
        Powerful{" "}
        <span className="bg-gradient-to-r from-blue-200 to-sky-200 bg-clip-text text-transparent">
          Market Insights
        </span>
        , Simplified
      </h1>
      <p className="text-2xl text-white z-10">
        SmartStart is your AI-Powered Commodity Analyst
      </p>
      <NavLink to="/chat">
        <Button color="white" className="z-10 cursor-pointer">
          Try a demo
        </Button>
      </NavLink>
    </div>
  );
}
