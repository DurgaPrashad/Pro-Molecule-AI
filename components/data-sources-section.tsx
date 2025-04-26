"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database, Download, RefreshCw } from "lucide-react"

export function DataSourcesSection() {
  const [isLoading, setIsLoading] = useState(false)

  const handleFetchData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ChEMBL</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-2">
            Bioactivity data from the European Molecular Biology Laboratory
          </div>
          <Progress value={87} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">Last updated: 2 days ago</div>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full" onClick={handleFetchData} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Fetch Data
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">DrugBank</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-2">Comprehensive drug and drug target information</div>
          <Progress value={92} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">Last updated: 1 day ago</div>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full" onClick={handleFetchData} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Fetch Data
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PubChem</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-2">
            Chemical substance and biological activities database
          </div>
          <Progress value={78} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">Last updated: 3 days ago</div>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full" onClick={handleFetchData} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Fetch Data
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PDBbind</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-2">Protein-ligand binding affinity data</div>
          <Progress value={65} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">Last updated: 5 days ago</div>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full" onClick={handleFetchData} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Fetch Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

