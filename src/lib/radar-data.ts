import { AnalysisResult, ArgumentNode, Tweet, DetectedFallacy } from "./types";

// Helper to create basic nodes
const createNode = (id: string, parentId: string | null, type: 'thesis' | 'claim' | 'evidence' | 'counterclaim', side: 'for' | 'against', content: string): ArgumentNode => ({
    id,
    parentId,
    type,
    side,
    content,
    sourceText: "Mock source text for demonstration.",
    source: "https://example.com",
    fallacies: [],
    logicalRole: "Supporting point"
});

// Helper to create mock tweets
const createTweet = (id: string, text: string, name: string, handle: string, likes: number): Tweet => ({
    id,
    text,
    author: {
        name,
        username: handle,
        profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`
    },
    public_metrics: {
        retweet_count: Math.floor(likes * 0.4),
        reply_count: Math.floor(likes * 0.1),
        like_count: likes,
        impression_count: likes * 100
    },
    created_at: new Date().toISOString()
});

// Helper to create detected fallacies
const createFallacy = (
    id: string,
    name: string,
    severity: 'Critical' | 'Major' | 'Minor',
    category: string,
    confidence: number,
    problematicText: string,
    explanation: string,
    definition: string,
    avoidance: string,
    example: string,
    suggestion: string,
    location: string
): DetectedFallacy => ({
    id,
    name,
    severity,
    category,
    confidence,
    problematicText,
    explanation,
    definition,
    avoidance,
    example,
    suggestion,
    location
});

export const RADAR_TOPICS: { id: string; title: string; subtitle: string; image: string; data: AnalysisResult }[] = [
    {
        id: "one-nation-one-election",
        title: "One Nation, One Election",
        subtitle: "The push for simultaneous polls vs. federal structure.",
        image: "https://placehold.co/600x400/orange/white?text=One+Nation",
        data: {
            blueprint: [
                createNode("t1", null, "thesis", "for", "India should implement 'One Nation, One Election' to synchronize Lok Sabha and State Assembly polls."),
                createNode("c1", "t1", "claim", "for", "It significantly reduces the massive financial burden of frequent elections."),
                createNode("e1", "c1", "evidence", "for", "The 2019 Lok Sabha elections cost an estimated ₹60,000 crore. Simultaneous polls could cut this by half."),
                createNode("c2", "t1", "claim", "for", "Governance suffers due to the constant imposition of the Model Code of Conduct (MCC)."),
                createNode("cc1", "t1", "counterclaim", "against", "It undermines federalism and local issues get overshadowed by national narratives."),
                createNode("ecc1", "cc1", "evidence", "against", "Voters tend to vote for the same party when elections are held together, disadvantaging regional parties."),
            ],
            summary: "The debate centers on efficiency vs. federalism. Proponents argue it saves money and ensures continuity in governance, while critics fear it centralizes power and marginalizes regional political voices.",
            analysis: "This is a structural reform debate. The economic argument is strong, but the constitutional challenge regarding the tenure of state assemblies is the main bottleneck.",
            socialPulse: "The conversation is highly polarized. Supporters verify it as a necessary step for 'Viksit Bharat', citing cost savings. Opponents call it 'anti-federal' and 'dictatorial', fearing it kills regional diversity.",
            tweets: [
                createTweet("tw1", "Finally! Why do we need to be in election mode 24/7? One Nation One Election will save thousands of crores and focus on governance. 🇮🇳 #ONOE", "Rajesh Kumar", "rajesh_ind", 5240),
                createTweet("tw2", "This is the end of federalism. Regional parties will be wiped out if they have to compete directly with national narratives for local elections. Danger to democracy.", "Sonia G", "sonia_voice", 3100),
                createTweet("tw3", "The Model Code of Conduct paralyzes development for months every year. Simultaneous elections are purely logical. Opponents are just scared of losing.", "Vikram Singh", "vikram_bjp", 4500),
                createTweet("tw4", "Logistical nightmare. How will you provide security forces for the entire country at once? Needs more debate, not hurried implementation.", "Amitabh D", "amitabh_pol", 1200)
            ],
            credibilityScore: 8,
            keyPoints: ["Cost reduction", "Governance continuity", "Threat to federalism", "Impact on regional parties"],
            brutalHonestTake: "Let's be real: this is less about 'saving money' and more about controlling the narrative. A single election cycle favors the party with the biggest face and the deepest pockets. The 'efficiency' argument is valid, but the real play is attempting to nationalize every local election, effectively nuking regional parties that rely on local issues to survive.",
            fallacies: [
                createFallacy(
                    "f1",
                    "False Dichotomy",
                    "Major",
                    "Logical Structure",
                    0.89,
                    "Either we implement simultaneous elections or we waste tax money forever.",
                    "This ignores other alternatives for cost-saving, such as strict campaign finance limits or shorter campaign periods, presenting only two extreme options.",
                    "A false dichotomy occurs when only two choices are presented as if they are the only possible options, when in fact more alternatives exist.",
                    "Consider multiple alternatives and acknowledge complexity.",
                    "Either you are with us, or you are with the terrorists.",
                    "Reform the election financing system or strictly enforce current spending limits instead of changing the entire schedule.",
                    "Supporter Arguments"
                ),
                createFallacy(
                    "f2",
                    "Slippery Slope",
                    "Minor",
                    "Causal Fallacy",
                    0.75,
                    "If we allow One Nation One Election, eventually they will abolish state assemblies entirely.",
                    "There is no evidence provided that synchronizing election dates logically leads to the abolition of the legislative bodies themselves.",
                    "A slippery slope argument suggests a minor action will lead to major, catastrophic consequences without evidence.",
                    "Evaluate the immediate effects of the policy rather than speculating on a chain reaction.",
                    "If I let you stay out late, soon you'll be doing drugs and dropping out of school.",
                    "Focus on the specific constitutional impacts of synchronizing terms rather than hypothetical abolition.",
                    "Critic Arguments"
                )
            ]
        }
    },
    {
        id: "ipac-vs-ed",
        title: "The I-PAC vs. ED Standoff",
        subtitle: "Federal Agencies vs. Political Strategy in West Bengal.",
        image: "https://placehold.co/600x400/red/white?text=IPAC+vs+ED",
        data: {
            blueprint: [
                createNode("t1", null, "thesis", "for", "The ED raids on I-PAC are a legitimate part of a money laundering investigation linked to the coal scam."),
                createNode("c1", "t1", "claim", "for", "The ED has evidence of financial links between the coal mafia and I-PAC's registered entities."),
                createNode("cc1", "t1", "counterclaim", "against", "The raids are politically motivated to steal TMC's election strategy ahead of 2026."),
                createNode("e1", "cc1", "evidence", "against", "Mamata Banerjee alleges that ED officials tried to seize hard drives containing internal party data."),
            ],
            summary: "A clash between federal investigation and political liberty. The ED claims it's following the money trail of a scam, while the TMC sees it as 'espionage' by the central government to hijack their election campaign.",
            analysis: "The timing is the critical factor here. While the legal investigation provides a cover, the targets (political consultants) suggest a strategic intent beyond just financial crimes.",
            socialPulse: "TMC cyber warriors are flooding timelines with #AgencyTerror, while BJP supporters are sharing documents alleging money laundering. Neutral observers are concerned about the precedent of raiding political consultants.",
            tweets: [
                createTweet("ip1", "ED raiding I-PAC is a new low. They are political consultants, not politicians! This is clearly to steal TMC's data before 2026. #AgencyMisuse", "Derek O'Brien", "derek_tmc", 8500),
                createTweet("ip2", "If you have nothing to hide, why panic? Money trail leads to I-PAC shell companies. Corruption must be rooted out, no matter who is involved. #CoalScam", "Suvendu Adhikari", "suvendu_bjp", 9200),
                createTweet("ip3", "Scary precedent. If election strategists aren't safe, democracy isn't safe. Are we becoming a surveillance state?", "Prannoy Roy", "prannoy_news", 6300),
            ],
            credibilityScore: 7,
            keyPoints: ["Coal scam investigation", "Political vendetta allegations", "Election strategy security", "Federal overreach"],
            brutalHonestTake: "Look, this is pretty standard political theater in Indian politics. When central agencies like the ED target opposition figures, you can bet your bottom dollar both sides will scream 'foul play' and 'political vendetta.' The ED claims Mamata barged in and snagged evidence; Mamata says it's a witch hunt to mess with her election strategy. It's less about the 'coal scam' in the public eye and more about who looks stronger. Can the Center bully the State? Or can the State mob the Center? Don't expect a clean legal resolution; this is a slugfest for optics.",
            fallacies: [
                createFallacy(
                    "f1",
                    "Ad Hominem",
                    "Critical",
                    "Relevance Fallacy",
                    0.92,
                    "The TMC is just a party of thieves, so their complaints about the raid are invalid.",
                    "Attacking the character of the party members avoids addressing the actual legal question of whether the raid procedure was followed correctly.",
                    "Ad hominem is attacking the person making the argument rather than the argument itself.",
                    "Focus on the legality of the warrant and the evidence, not the reputation of the accused.",
                    "You can't trust his policy ideas because he cheated on his wife.",
                    "Address whether the ED had sufficient cause for the raid regardless of the party's reputation.",
                    "Supporter Arguments"
                ),
                createFallacy(
                    "f2",
                    "Appeal to Motive",
                    "Major",
                    "Relevance Fallacy",
                    0.85,
                    "The ED is only doing this because the BJP wants to win Bengal.",
                    "Even if the motive is political, it does not automtically mean the evidence of money laundering is fake. A true crime can be investigated for political reasons.",
                    "Dismissing an argument by questioning the motives of the proposer rather than the facts.",
                    "Separate the investigator's potential bias from the validity of the evidence found.",
                    "He only wants to lower taxes because he is rich.",
                    "Evaluate the financial evidence on its own merits, separate from the timing.",
                    "Critic Arguments"
                )
            ]
        }
    },
    {
        id: "delimitation-crisis",
        title: "The Delimitation Crisis",
        subtitle: "North vs. South: The battle for political representation.",
        image: "https://placehold.co/600x400/blue/white?text=North+vs+South",
        data: {
            blueprint: [
                createNode("t1", null, "thesis", "for", "The upcoming delimitation of constituencies is necessary to ensure equal representation for every citizen."),
                createNode("c1", "t1", "claim", "for", "The principle of 'one person, one vote' is violated if populous northern states are under-represented."),
                createNode("cc1", "t1", "counterclaim", "against", "Punishing southern states for successful population control is unfair and weakens the federal union."),
                createNode("e1", "cc1", "evidence", "against", "Projected seat changes could see the South lose 20-30% of its political weight in Parliament."),
            ],
            summary: "A looming constitutional crisis. The North demands representation based on current population, while the South argues that this penalizes their progress in development and population control.",
            analysis: "This aims to be the biggest friction point in Indian federalism. A purely mathematical approach threatens to alienate the most economically productive states.",
            socialPulse: "Southern Twitter is ablaze with #StopDelimitation and #SouthTax. The sentiment is defensive and angry. Northern discourse is quieter, mostly focused on democratic equality.",
            tweets: [
                createTweet("dl1", "Why should Tamil Nadu fail for being successful? We controlled population, educated our women. Now our voice in Parliament will shrink? Unfair! #SouthMatters", "Kanimozhi", "kani_dmk", 12000),
                createTweet("dl2", "1 citizen = 1 vote. A voter in UP cannot have half the value of a voter in Kerala. Democracy demands equal representation. Delimitation is overdue.", "Yogi Adityanath Office", "myogi_office", 15000),
                createTweet("dl3", "This isn't just math, it's about the federal compact. You cannot penalize the engines of growth. Freeze the seats or face a divide.", "Shashi Tharoor", "shashi_inc", 9800),
            ],
            credibilityScore: 9,
            keyPoints: ["Population-based representation", "Penalty for progress", "North-South divide", "Federal stability"],
            brutalHonestTake: "This is the ticking time bomb of Indian democracy. The South is effectively being told: 'Congratulations on educating your women and fixing your economy! Your reward is... less political power.' Meanwhile, the North, which hasn't fixed its population growth, gets MORE seats. It's objectively unfair, but purely democratic (1 person = 1 vote). There is no happy middle ground here. Someone is going to get screwed, and it's probably going to be the South.",
            fallacies: [
                createFallacy(
                    "f1",
                    "Straw Man",
                    "Minor",
                    "Informal Fallacy",
                    0.80,
                    "The South wants to deny voting rights to people in Uttar Pradesh.",
                    "Southern states are arguing for freezing seat counts, not denying individual voting rights. This misrepresents their position to make it easier to attack.",
                    "Misrepresenting an opponent's argument to make it easier to attack.",
                    "Accurately state the opponent's position (seat freeze) before debating it.",
                    "People who want gun control just want to ban all weapons and leave us defenseless.",
                    "Address the argument about federal representation balance, not individual disenfranchisement.",
                    "Supporter Arguments"
                ),
                createFallacy(
                    "f2",
                    "False Equivalence",
                    "Major",
                    "Logical Fallacy",
                    0.88,
                    "Population control is just like economic growth; the North shouldn't be punished for being 'poorer' in population management.",
                    "Managing population growth is a specific policy outcome linked to education and health, not just an economic circumstance. Equating failure to implement policy with victimhood is misleading.",
                    "Describing two situations as equivalent when there are critical difference.",
                    "Acknowledge that population stats are a result of decades of policy implementation.",
                    "A cat and a dog are both pets, so they should eat the same food.",
                    "Recognize that the population disparity is a result of divergent policy success.",
                    "Critic Arguments"
                )
            ]
        }
    },
    {
        id: "waqf-bill-2025",
        title: "The Waqf Amendment Bill 2025",
        subtitle: "Reforming usage rights or targeting minority assets?",
        image: "https://placehold.co/600x400/green/white?text=Waqf+Bill",
        data: {
            blueprint: [
                createNode("t1", null, "thesis", "for", "The Waqf Amendment Bill is needed to bring transparency and reduce the arbitrary powers of Waqf Boards."),
                createNode("c1", "t1", "claim", "for", "Waqf boards currently have unchecked power to declare any property as Waqf without sufficient evidence."),
                createNode("cc1", "t1", "counterclaim", "against", "The bill is a veiled attempt to seize Muslim community assets and interfere in religious affairs."),
                createNode("e1", "cc1", "evidence", "against", "The inclusion of non-Muslims in Waqf boards is seen as direct government interference in religious management."),
            ],
            summary: "The government pitches it as a transparency reform to stop land grabbing, while the opposition and community leaders view it as a mechanism to dismantle the autonomy of Muslim religious endowments.",
            analysis: "The core issue is the 'absolute' power of the Board vs. the right to judicial review. The amendment seeks to shift power to the Collector, which critics argue invites executive bias.",
            socialPulse: "Trending with #SaveWaqf and #WaqfReform. One side highlights cases of land grabbing by Waqf boards as justification, while the other side calls it 'Land Jihad' by the state.",
            tweets: [
                createTweet("wq1", "The arbitrary power to claim land needs to go. I've seen farmers lose land because a Board claimed it. Transparency is a right, not a favor. #WaqfAmendment", "Kiren Rijiju", "kiren_bjp", 7500),
                createTweet("wq2", "This bill attacks the Constitution. Article 26 gives us right to manage religious affairs. Adding non-Muslims to the board is like asking vegetarians to run a steakhouse.", "Asaduddin Owaisi", "asadowaisi", 11000),
                createTweet("wq3", "It's about land, not religion. Why should one board have unchecked power? Judicial review is essential for democracy.", "Legal Eagle", "lawyer_ind", 3200),
            ],
            credibilityScore: 7,
            keyPoints: ["Transparency vs. Autonomy", "Land dispute resolution", "Role of District Collector", "Minority rights"],
            brutalHonestTake: "It's a power grab, plain and simple. The government says 'transparency', but giving a District Collector (a government employee) the power to decide religious land disputes is practically handing the keys to the ruling party. On the flip side, the Waqf Board's power *was* unusually unchecked compared to other religious trusts. But let's not pretend this is just about 'clean governance'—it's about the State reasserting control over a massive independent asset base.",
            fallacies: [
                createFallacy(
                    "f1",
                    "Red Herring",
                    "Major",
                    "Relevance Fallacy",
                    0.80,
                    "Opponents of the bill are just trying to protect 'Land Jihad'.",
                    "Using an inflammatory and unverified term like 'Land Jihad' distracts from the actual legal text of the bill regarding property registration and survey powers.",
                    "Introducing an irrelevant topic to divert attention from the main issue.",
                    "Stick to the specific clauses of the bill (e.g., Section 40) rather than using communal buzzwords.",
                    "We shouldn't worry about the environment because the economy is struggling.",
                    "Debate the specific powers of the Collector vs the Board, not conspiracy theories.",
                    "Supporter Arguments"
                ),
                createFallacy(
                    "f2",
                    "Appeal to Fear",
                    "Major",
                    "Emotional Fallacy",
                    0.78,
                    "If this bill passes, the government will seize every single mosque in India.",
                    "While the bill changes management structures, claiming total seizure of all religious sites is an exaggeration designed to cause panic.",
                    "Using fear to influence the audience's reaction rather than logic.",
                    "Cite specific provisions that allow for takeover rather than generalizing to total destruction.",
                    "If you don't buy this insurance, your family will be destitute when you die.",
                    "Focus on the risk to specific disputed properties rather than reliable religious sites.",
                    "Critic Arguments"
                )
            ]
        }
    }
];
