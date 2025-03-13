import "@fontsource/inter/600.css";
import "@fontsource/inter/400.css";
import { Logo } from "../../components/Logo";
import Constellation from "./Constellation";
import AboutHero from "./Hero";

export default function AboutPage() {
    return (
        <>
           <AboutHero />
            <div className="content">
                <h1>Meet the Team</h1>
            </div>
        </>
    );
}