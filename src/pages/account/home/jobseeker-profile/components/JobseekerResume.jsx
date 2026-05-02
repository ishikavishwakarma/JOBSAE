import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Upload } from 'lucide-react';

export function JobseekerResume() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Resume</CardTitle>
        <Button size="sm">
          <Upload className="size-4 mr-2" /> Upload New Resume
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="size-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Jason_Tatum_Resume.pdf</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Updated 2 days ago • 245 KB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
