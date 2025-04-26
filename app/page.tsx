import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedMoleculeViewer } from "@/components/advanced-molecule-viewer"
import { DataSourcesSection } from "@/components/data-sources-section"
import { ModelGenerationSection } from "@/components/model-generation-section"
import { PredictionSection } from "@/components/prediction-section"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { AIPropertyPrediction } from "@/components/ai-property-prediction"
import { AIChatAssistant } from "@/components/ai-chat-assistant"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">MoleculeAI</h1>
          <nav className="ml-auto flex gap-4">
            <Button variant="link">Dashboard</Button>
            <Button variant="link">Molecules</Button>
            <Button variant="link">Models</Button>
            <Button variant="link">Predictions</Button>
            <Button variant="link">Documentation</Button>
            <Button variant="default">Sign In</Button>
          </nav>
        </div>
      </header>

      <div className="container px-4 py-6">
        <DashboardStats />

        <Tabs defaultValue="generate" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="generate">Generate Molecules</TabsTrigger>
            <TabsTrigger value="predict">Predict Interactions</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="data">
            <DataSourcesSection />
          </TabsContent>
          <TabsContent value="generate">
            <ModelGenerationSection />
          </TabsContent>
          <TabsContent value="predict">
            <PredictionSection />
          </TabsContent>
          <TabsContent value="ai">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Advanced AI Tools</h2>
              <AIPropertyPrediction />
              <AIChatAssistant />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent drug discovery activities</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3D Molecule Viewer</CardTitle>
              <CardDescription>Visualize molecular structures</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AdvancedMoleculeViewer />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

